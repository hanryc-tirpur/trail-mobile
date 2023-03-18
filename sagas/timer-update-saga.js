import { fork, take, call, cancel, put } from 'redux-saga/effects'
import { eventChannel, } from 'redux-saga'

import { updateElapsedTime } from '../reducers/activity'


function segmentTimer(activityMilliseconds = 0) {
  return eventChannel(emit => {
      const segmentStartMilliseconds = Date.now()
      const iv = setInterval(() => {
        emit(activityMilliseconds + (Date.now() - segmentStartMilliseconds))
      }, 100);
      return () => {
        clearInterval(iv)
      }
    }
  )
}

export function* segmentTimeSaga(activityMilliseconds = 0) {
  const chan = yield call(segmentTimer, activityMilliseconds)
  let total = 0
  try {    
    while (true) {
      total = yield take(chan)
      // console.log(`activityMilliseconds: ${total}`)
      yield put(updateElapsedTime({ total }))
    }
  } finally {
    console.log(`Segment ended after ${total / 1000} seconds.`)
  }
}

export default function* saga() {
  while(yield take('timer/start-segment-timer')) {
    const segmentTimer = yield fork(segmentTimeSaga)

    yield take('timer/stop-segment-timer')
    yield cancel(segmentTimer)
  }
}
