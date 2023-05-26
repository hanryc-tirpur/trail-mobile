import { create } from 'zustand'
import { shallow, } from 'zustand/shallow'
import { activitiesStore } from './activitiesStore'

const useActivitiesStore = create(activitiesStore)

export const useActivitiesActions = () => useActivitiesStore(state => state.actions)
export const useAllActivities = () => useActivitiesStore(state => ({
  allActivities: state.syncedActivities.concat(state.syncedActivities)
}), shallow)
