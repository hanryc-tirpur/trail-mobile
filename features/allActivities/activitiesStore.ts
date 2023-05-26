import AsyncStorage from '@react-native-async-storage/async-storage'
import { StateCreator, } from 'zustand'
import { createStore } from 'zustand/vanilla'
import { createJSONStorage, persist } from 'zustand/middleware'

import { ActivitiesStore, CompletedActivity } from './activityTypes'

// import { unstable_batchedUpdates } from 'react-native'

const ACTIVITIES_STORE_KEY = 'trail/activities'


const activitiesState: StateCreator<ActivitiesStore> = (set, get) => ({
  syncedActivities: [],
  unsyncedActivities: [],
  actions: {
    addUnsyncedActivity(activity: CompletedActivity) {
      const { unsyncedActivities } = get()
      set({
        unsyncedActivities: [
          ... unsyncedActivities,
          activity,
        ]
      })
    }
  }
})

export const activitiesStore = createStore(persist(activitiesState, {
  name: ACTIVITIES_STORE_KEY,
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

      console.log('rehydrated activities', state)
    }
  }
}))
