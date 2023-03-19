import { fork, take, call, cancel, put } from 'redux-saga/effects'
import { eventChannel, } from 'redux-saga'

import { timerTick } from './activitySlice'


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
      yield put(timerTick())
    }
  } finally {
    console.log(`Segment ended after ${total / 1000} seconds.`)
  }
}

export default function* saga() {
  while(yield take(START_TIMER)) {
    const segmentTimer = yield fork(segmentTimeSaga)

    yield take(STOP_TIMER)
    yield cancel(segmentTimer)
  }
}


// export const TIMER_TICK = 'timer/tick'
// export function timerTick() {
//   return {
//     type: TIMER_TICK,
//   }
// }

const START_TIMER = 'timer/start-timer'
export function startTimer() {
  return {
    type: START_TIMER,
  }
}

const STOP_TIMER = 'timer/stop-timer'
export function stopTimer() {
  return {
    type: STOP_TIMER,
  }
}
