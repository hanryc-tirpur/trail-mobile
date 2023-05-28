import { cancel, fork, take, put, call, cancelled, takeEvery, select, } from 'redux-saga/effects'

import { finishActivity } from './activitySlice'
import { saveActivity as saveToUrbit } from '../../data/urbitApiSaga'
import { addActivity } from '../../screens/activitiesSlice'

export default function* watchForSaveActivity() {
  yield takeEvery(FINISH_ACTIVITY_SAGA, saveActivitySaga)
}

function* saveActivitySaga() {
  const activityState = yield select(s => s.activity)
  yield call(saveActivity, activityState.activity)
  yield put(addActivity({ activity: activityState.activity }))
  yield put(finishActivity())
}

export const FINISH_ACTIVITY_SAGA = 'save-activity-saga/finish-activity'
export function finishActivitySaga() {
  return {
    type: FINISH_ACTIVITY_SAGA,
  }
}
