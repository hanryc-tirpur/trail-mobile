import { useDispatch, useSelector } from 'react-redux'
import polyline from '@mapbox/polyline'

import { pokeRequest } from './urbitApiSaga'
import useAllActivities from '../hooks/useAllActivities'


const toServerSegment = serverSegment => {
  return {
    polyline: {
      startTime: serverSegment.startTime,
      endTime: serverSegment.endTime,
      timeElapsed: serverSegment.endTime - serverSegment.startTime,
      distance: {
        val: serverSegment.distance,
        unit: 'km',
      },
      path: polyline.encode(serverSegment.locationEntries.map(e => [e.latitude, e.longitude]))
    }
  }
}

const toServerActivity = clientActivity => {
  return {
    id: clientActivity.startTime,
    activityType: clientActivity.activityType || 'walk',
    name: clientActivity.name,
    timeActive: clientActivity.timeActive,
    timeElapsed: clientActivity.timeElapsed,
    totalDistance: {
      val: clientActivity.totalDistance,
      unit: 'km',
    },
    segments: clientActivity.completedSegments.map(toServerSegment),
  }
}

export default function useSyncUnsavedActivities() {
  const dispatch = useDispatch()
  const [ hasActivities, activityData ] = useAllActivities()

  if(!hasActivities) {
    return () => {}
  }

  const act = activityData.unsavedActivities[0]

  return () => dispatch(pokeRequest({
    app: 'trail',
    mark: 'trail-action',
    json: {
      'save-activity': {
        'tracked': toServerActivity(act),
      }
    }
  }))
}
