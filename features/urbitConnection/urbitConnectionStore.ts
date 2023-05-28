import AsyncStorage from '@react-native-async-storage/async-storage'
import { configureApi } from '@uqbar/react-native-api/configureApi'
import { StateCreator, create } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist } from 'zustand/middleware'
import { shallow, } from 'zustand/shallow'

import { initializeApi, poke } from '../../data/urbitApiSaga'
import { UrbitStore } from './urbitTypes'
import { publish } from './urbitBus'
import { CompletedActivity } from '../allActivities/activityTypes'

// import { unstable_batchedUpdates } from 'react-native'

const URBIT_STORE_KEY = 'trail/urbit'


const urbitStore: StateCreator<UrbitStore> = (set, get) => ({
  isConnected: false,
  actions: {
    connect: connection => {
      const api = configureApi(connection.ship, connection.shipUrl)
      initializeApi(connection)
      set({
        isConnected: true,
        connection,
        api
      })
    },
    setConnectionStatus: isConnected => {
      set({
        isConnected,
      })
    },
    syncActivity: async (activity: CompletedActivity) => {
      const { isConnected, } = get()
      console.log({
        'save-activity': {
          'tracked': activity,
        }
      })
      if(isConnected) {
        await poke({
          app: 'trail',
          mark: 'trail-action',
          json: {
            'save-activity': {
              'tracked': {
                ... activity,
                segments: activity.segments.map(seg => ({
                  'polyline': seg,
                }))
              },
            }
          }
        })
      }
    },
  }
})

export const urbitConnectionStore = createStore(persist(urbitStore, {
  name: URBIT_STORE_KEY,
  version: 1,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: state => {
    const { actions, isConnected, ...rest } = state
    return { ...rest }
  },
  onRehydrateStorage: state => {
    return (state, error) => {
      if(!state) {
        return
      }

      if(state.connection) {
        initializeApi(state.connection)
        publish(state.connection)
      }
      console.log('rehydrated', state)
    }
  }
}))
