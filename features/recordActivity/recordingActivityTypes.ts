import { Distance } from '../../util/distanceCalculator'

export interface RecordingActivityState {
  isComplete: boolean,
  isPaused: boolean,
  isStarted: boolean,

  activity: InProgressActivity,
}

export interface InProgressActivity {
  activityType?: ActivityType,
  name?: string,
  timeActive: number,
  timeElapsed: number,
  startTime: number,
  totalDistance: Distance,

  completedSegments: CompletedInProgressSegment[],
  currentSegment: InProgressSegment | null,
}

export enum ActivityType {
  Ride = 'ride',
  Run = 'run',
  Walk = 'walk',
}

export interface InProgressSegment {
  distance: Distance,
  startTime: number,

  locationEntries: LocationEntry[],
}

export interface CompletedInProgressSegment extends InProgressSegment {
  endTime: number,
}

export interface LocationEntry {
  latitude: number,
  longitude: number,
}