import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import activityReducer from './reducers/activity'
import locationUpdateSaga from './sagas/location-update-saga'
import timerUpdateSaga from './sagas/timer-update-saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    activity: activityReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ sagaMiddleware ]),
})

sagaMiddleware.run(locationUpdateSaga)
sagaMiddleware.run(timerUpdateSaga)
