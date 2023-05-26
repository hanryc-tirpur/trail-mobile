import { StateCreator, create } from 'zustand'
import { shallow, } from 'zustand/shallow'

import { CompletedActivity } from '../allActivities/activityTypes'

interface ViewActivityStore {
  activity: CompletedActivity | null,
  actions: {
    viewActivity: (activity: CompletedActivity) => void,
  }
}


const viewActivityStore: StateCreator<ViewActivityStore> = (set, get) => ({
  activity: null,
  actions: {
    viewActivity(activity) {
      set( { activity })
    }
  }
})

const useViewActivityStore = create(viewActivityStore)

export const useViewActivityActions = () => useViewActivityStore(state => state.actions)

export const useViewActivity = () => useViewActivityStore(state => state.activity, shallow)
