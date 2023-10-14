import { create } from 'zustand'
import { shallow, } from 'zustand/shallow'
import { activitiesStore } from './activitiesStore'
import { CompletedActivity } from './activityTypes'

const useActivitiesStore = create(activitiesStore)

export const useActivitiesActions = () => useActivitiesStore(state => state.actions)
export const useAllActivities = () => useActivitiesStore(state => {
  return state.syncedActivities.concat(state.unsyncedActivities)
    .sort((a, b) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0)
}, shallow)
export const useSavedActivity = (id: number): CompletedActivity => useActivitiesStore(state => {
  const synced = state.syncedActivities.find(a => a.id === id)
  if(synced) return synced
  const unsynced = state.unsyncedActivities.find(a => a.id === id)
  if(unsynced) return unsynced
  throw Error(`This should not happen. Id: ${id} not found, but you clicked on it? Weird.`)
}, shallow)
export const useUnsyncedActivities = () => 
  useActivitiesStore(state => state.unsyncedActivities, shallow)
