import { cancel, fork, take, put, call, cancelled, } from 'redux-saga/effects'

import { locationChannel } from './locationChannel'

import { updateLocation as updateActivityLocation } from './activitySlice'
import { updateLocation } from './locationSlice'


export function* trackPositionSaga() {
  try {    
    while (true) {
      const position = yield take(locationChannel)
      // console.log(`New position ${JSON.stringify(position)}`)
      yield put(updateLocation({ location: position }))
      yield put(updateActivityLocation({ location: position }))
    }
  } finally {
    if(yield cancelled()) {
      console.log('Stopped position tracking.')
    }
  }
}

export default function* saga() {
  while(yield take(START_LOCATION_TRACKING)) {
    const locationTracker = yield fork(trackPositionSaga)

    yield take(STOP_LOCATION_TRACKING)
    console.log('Cancelling position tracking...')
    yield cancel(locationTracker)
  }
}


const START_LOCATION_TRACKING = 'location/start-track-location'
export function startLocationTracking() {
  return {
    type: START_LOCATION_TRACKING,
  }
}

const STOP_LOCATION_TRACKING = 'location/stop-track-location'
export function stopLocationTracking() {
  return {
    type: STOP_LOCATION_TRACKING,
  }
}
