import { create } from 'zustand'
import { shallow, } from 'zustand/shallow'
import { activitiesStore } from './activitiesStore'

const useActivitiesStore = create(activitiesStore)

export const useActivitiesActions = () => useActivitiesStore(state => state.actions)
export const useAllActivities = () => useActivitiesStore(state => {
  return state.syncedActivities.concat(state.unsyncedActivities)
    .sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0)
}, shallow)
export const useUnsyncedActivities = () => 
  useActivitiesStore(state => state.unsyncedActivities, shallow)
