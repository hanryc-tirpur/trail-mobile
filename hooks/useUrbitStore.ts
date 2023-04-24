import AsyncStorage from '@react-native-async-storage/async-storage'
import Urbit from '@uqbar/react-native-api'
import { configureApi } from '@uqbar/react-native-api/configureApi'
import { StateCreator, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { shallow, } from 'zustand/shallow'
import { initializeApi } from '../data/urbitApiSaga'

const URBIT_STORE_KEY = 'trail/urbit'

declare global {
  var api: Urbit;
  var window: Window & typeof globalThis;
  var ship: string;
}

interface UrbitStore {
  isConnected: boolean;
  connection?: ShipConnection;
  api?: Urbit;
  actions: {
    connect: (connection: ShipConnection) => void;
  }
}

export interface ShipConnection {
  ship: string;
  shipUrl: string;
  authCookie: string;
}

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
  }
})

const useUrbitStore = create(persist(urbitStore, {
  name: 'trail/urbit',
  version: 1,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: state => {
    const { actions, ...rest } = state
    return { ...rest }
  },
  onRehydrateStorage: state => {
    return (state, error) => {
      if(!state) {
        return
      }

      if(state.isConnected) {
        initializeApi(state.connection)
      }
      console.log('rehydrated', state)
    }
  }
}))

export const useUrbitActions = () => useUrbitStore(state => state.actions)
export const useUrbitApi = () => useUrbitStore(state => ({
  isConnected: state.isConnected,
  api: state.api,
}), shallow)
export const useUrbitConnection = () => useUrbitStore(state => ({
  isConnected: state.isConnected,
  connection: state.connection,
}), shallow)
