import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  completedSegments: [],
  currentSegment: null,
  elapsedTime: 0,
  isPaused: false,
  isStarted: false,
  startTime: 0,
  totalDistance: 0,
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    pauseActivity: (state, action) => {
      const { pauseTime, pauseLocation, } = action.payload

      state.isPaused = true
      state.completedSegments.push({
        ... state.currentSegment,
        locationEntries: {
          ... state.locationEntries,
          pauseLocation,
        },
        endTime: pauseTime,
      })
    },
    resumeActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload

      state.isPaused = false
      state.currentSegment = {
        endTime: null,
        locationEntries: [initialLocation],
        startTime,
      }
    },
    startActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload

      state.isStarted = true
      state.startTime = startTime
      state.currentSegment = {
        endTime: null,
        locationEntries: [initialLocation],
        startTime,
      }
    },
    timerTick: (state) => {
      console.log(state)
      state.elapsedTime = Date.now() - state.startTime
    },
  },
})

// Action creators are generated for each case reducer function
export const { pauseActivity, resumeActivity, startActivity, timerTick, } = activitySlice.actions

export default activitySlice.reducer
