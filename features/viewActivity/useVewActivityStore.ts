import { StateCreator, create } from 'zustand'
import { shallow, } from 'zustand/shallow'

import { ActivityType, InProgressActivity } from '../recordActivity/recordingActivityTypes'

interface ViewActivityStore {
  activity: InProgressActivity | null,
  actions: {
    changeActivityType: (activityType: ActivityType) => void,
    clearActivity: () => void,
    viewActivity: (activity: InProgressActivity) => void,
  }
}


const viewActivityStore: StateCreator<ViewActivityStore> = (set, get) => ({
  activity: null,
  actions: {
    changeActivityType(activityType) {
      const { activity } = get()
      console.log('setting activity type', activityType)
      activity !== null && set({
        activity: {
          ... activity,
          activityType,
        }
      })
    },
    clearActivity() {
      set({ activity: null })
    },
    viewActivity(activity) {
      set( { activity })
    },
  }
})

const useViewActivityStore = create(viewActivityStore)

export const useViewActivityActions = () => useViewActivityStore(state => state.actions)

export const useViewActivity = () => useViewActivityStore(state => ({ 
  activity: state.activity,
  hasActivity: state.activity !== null,
}), shallow)
