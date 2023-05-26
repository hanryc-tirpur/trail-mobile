import { Distance, } from '../../util/distanceCalculator'

export interface ActivitiesStore {
  syncedActivities: CompletedActivity[],
  unsyncedActivities: CompletedActivity[],
  actions: {
    addUnsyncedActivity: (activity: CompletedActivity) => void,
  }
}

export interface ActivitySegment {
  distance: Distance,
  startTime: number,
  timeElapsed: number,

  path: string,
}

export interface CompletedSegment extends ActivitySegment {
  endTime: number,
}

export enum ActivityType {
  Ride = 'ride',
  Run = 'run',
  Walk = 'walk',
}

export interface CompletedActivity {
  id: number,
  activityType: ActivityType,
  name: string,
  timeActive: number,
  timeElapsed: number,
  totalDistance: Distance,

  segments: CompletedSegment[],
}

export interface LocationEntry {
  latitude: number,
  longitude: number,
}
