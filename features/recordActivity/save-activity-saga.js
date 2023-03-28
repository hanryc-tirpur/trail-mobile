import { cancel, fork, take, put, call, cancelled, takeEvery, select, } from 'redux-saga/effects'

import { finishActivity } from './activitySlice'
import { saveActivity } from '../../data/storage'

export default function* watchForSaveActivity() {
  yield takeEvery(FINISH_ACTIVITY_SAGA, saveActivitySaga)
}

function* saveActivitySaga() {
  yield put(finishActivity())
  const activityState = yield select(s => s.activity)
  yield call(saveActivity, activityState.activity)
}

export const FINISH_ACTIVITY_SAGA = 'save-activity-saga/finish-activity'
export function finishActivitySaga() {
  return {
    type: FINISH_ACTIVITY_SAGA,
  }
}
