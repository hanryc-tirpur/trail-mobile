import { cancel, fork, take, put, call, cancelled, } from 'redux-saga/effects'
import { eventChannel, } from 'redux-saga'
import { watchPositionAsync } from 'expo-location'
import { Accuracy } from 'expo-location'

import { updateLocation } from './locationSlice'

function startWatchingPosition() {
  return eventChannel(emitter => {
    let subscription 

    async function doSub() {
      subscription = await watchPositionAsync({
        // Tracking options
        accuracy: Accuracy.Highest,
        distanceInterval: 5,
      }, location => {
        emitter(location)
      })
    }
    doSub()

    return () => {
      subscription?.remove()
    }
  })
}

export function* trackPositionSaga() {
  const chan = yield call(startWatchingPosition)
  
  try {    
    while (true) {
      const position = yield take(chan)
      console.log(`New position ${JSON.stringify(position)}`)
      yield put(updateLocation({ location: position }))
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
