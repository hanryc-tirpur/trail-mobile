import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'

import { activitySlice } from './features/recordActivity/activitySlice'
import { locationSlice } from './features/recordActivity/locationSlice'
import locationUpdateSaga from './features/recordActivity/location-update-saga'
import timerUpdateSaga from './features/recordActivity/timer-update-saga'
import saveActivitySaga from './features/recordActivity/save-activity-saga'

const sagaMiddleware = createSagaMiddleware()

export const store = configureStore({
  reducer: {
    [activitySlice.name]: activitySlice.reducer,
    [locationSlice.name]: locationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([ sagaMiddleware ]),
})

sagaMiddleware.run(locationUpdateSaga)
sagaMiddleware.run(timerUpdateSaga)
sagaMiddleware.run(saveActivitySaga)
