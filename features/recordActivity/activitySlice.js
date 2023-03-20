import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  completedSegments: [],
  currentSegment: null,
  elapsedTime: 0,
  isComplete: false,
  isPaused: false,
  isStarted: false,
  startTime: 0,
  totalDistance: 0,
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    finishActivity: (state, action) => {
      const { finishTime, finishLocation, } = action.payload

      state.isComplete = true
      state.isPaused = false
      state.completedSegments.push({
        ... state.currentSegment,
        locationEntries: [
          ... state.currentSegment.locationEntries,
          finishLocation.coords,
        ],
        endTime: finishTime,
      })
    },
    pauseActivity: (state, action) => {
      const { pauseTime, pauseLocation, } = action.payload

      state.isPaused = true
      state.completedSegments.push({
        ... state.currentSegment,
        locationEntries: [
          ... state.currentSegment.locationEntries,
          pauseLocation.coords,
        ],
        endTime: pauseTime,
      })
    },
    resumeActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload

      state.isPaused = false
      state.currentSegment = {
        distance: 0,
        endTime: null,
        locationEntries: [initialLocation.coords],
        startTime,
      }
    },
    startActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload

      state.isStarted = true
      state.startTime = startTime
      state.currentSegment = {
        distance: 0,
        endTime: null,
        locationEntries: [initialLocation.coords],
        startTime,
      }
    },
    timerTick: (state) => {
      state.elapsedTime = Date.now() - state.startTime
    },
    updateLocation: (state, { payload }) => {
      if(!state.isStarted || state.isPaused) {
        return state
      }

      const { location } = payload
      const { coords, timestamp } = location
      const previousCoords = getLast(state.currentSegment.locationEntries)

      state.currentSegment.distance += computeDistance(previousCoords, coords)
      state.currentSegment.locationEntries.push(coords)

      state.totalDistance = state.completedSegments.reduce((sum, seg) => {
        return sum += seg.distance
      }, state.currentSegment.distance)
    },
  },
})

// Action creators are generated for each case reducer function
export const {
  finishActivity,
  pauseActivity,
  resumeActivity,
  startActivity,
  timerTick,
  updateLocation,
} = activitySlice.actions

export default activitySlice.reducer


function computeDistance({ latitude: prevLat, longitude: prevLong }, { latitude: lat, longitude: long }) {
  const prevLatInRad = toRad(prevLat)
  const prevLongInRad = toRad(prevLong)
  const latInRad = toRad(lat)
  const longInRad = toRad(long)

  return (
    // In kilometers
    6377.830272 *
    Math.acos(
      Math.sin(prevLatInRad) * Math.sin(latInRad) +
        Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
    )
  )
}

function toRad(angle) {
  return (angle * Math.PI) / 180
}

function getLast(arr) {
  return arr[arr.length - 1]
}

