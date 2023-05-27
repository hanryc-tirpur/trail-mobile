import { Distance, } from '../../util/distanceCalculator'

export interface ActivitiesStore {
  syncedActivities: CompletedActivity[],
  unsyncedActivities: CompletedActivity[],
  actions: {
    addUnsyncedActivity: (activity: CompletedActivity) => void,
    addSyncedActivities: (activities: CompletedActivity[]) => void,
  }
}

export interface ActivitySegment {
  distance: Distance,
  startTime: number,
  timeElapsed: number,

}

export interface CompletedSegment extends ActivitySegment {
  endTime: number,
}

export interface CompletedLatLongSegment extends CompletedSegment {
  locationEntries: LatLongPair[]
}

export interface CompletedPathSegment extends CompletedSegment {
  path: string,
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

  segments: CompletedPathSegment[],
}

export type LatLongPair = [number, number]

export interface LocationEntry {
  latitude: number,
  longitude: number,
}
