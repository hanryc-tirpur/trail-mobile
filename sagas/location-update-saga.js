import { cancel, fork, take, put, call, cancelled, } from 'redux-saga/effects'
import { eventChannel, } from 'redux-saga'
import { watchPositionAsync } from 'expo-location'
import { Accuracy } from 'expo-location'

import { updateLocation } from '../reducers/activity'

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
  while(yield take('location/start-track-position')) {
    const locationTracker = yield fork(trackPositionSaga)

    yield take('location/stop-track-position')
    console.log('Cancelling position tracking...')
    yield cancel(locationTracker)
  }
}
