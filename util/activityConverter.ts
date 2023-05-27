import polyline from '@mapbox/polyline'

import {
  ActivityType,
  CompletedActivity,
  CompletedPathSegment,
} from "../features/allActivities/activityTypes";
import { CompletedInProgressSegment, InProgressActivity } from "../features/recordActivity/recordingActivityTypes";


export function toCompletedActivity(inProgress: InProgressActivity): CompletedActivity {
  return {
    id: inProgress.startTime,
    activityType: inProgress.activityType || ActivityType.Walk,
    name: inProgress.name || 'Unnamed Activity',
    timeActive: inProgress.timeActive,
    timeElapsed: inProgress.timeElapsed,
    totalDistance: inProgress.totalDistance,
    segments: inProgress.completedSegments.map(toCompletedSegment),
  }
}

function toCompletedSegment(inProgress: CompletedInProgressSegment): CompletedPathSegment {
  return {
    startTime: inProgress.startTime,
    endTime: inProgress.endTime,
    timeElapsed: inProgress.endTime - inProgress.startTime,
    distance: inProgress.distance,
    path: polyline.encode(inProgress.locationEntries.map(e => [e.latitude, e.longitude]))
  }
}

