import { race, call, put, delay } from 'redux-saga/effects'
import {
  
} from '../urbitStore'

export function* monitorUrbitConnection() {
  const { posts, timeout } = yield race({
    posts: call(fetchApi, '/posts'),
    timeout: delay(1000)
  })

  if (posts)
    yield put({type: 'POSTS_RECEIVED', posts})
  else
    yield put({type: 'TIMEOUT_ERROR'})
}
