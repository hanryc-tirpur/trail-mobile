import { createSlice, } from '@reduxjs/toolkit'

const emptySegment = {
  distanceTraveled: 0,
  elapsedTime: 0,
  path: [],
}

const initialState = {
  activeSegment: null,
  completedSegments: {
    distanceTraveled: 0,
    elapsedTime: 0,
    segments: [],
  },
  isTracking: false,
  region: {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  },
  totalDistanceTraveled: 0,
  totalElapsedTime: 0,
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    startActivitySegment: state => {
      state.activeSegment = emptySegment
      state.isTracking = true
    },
    stopActivitySegment: state => {
      state.completedSegments = {
        distanceTraveled: state.completedSegments.distanceTraveled + state.activeSegment.distanceTraveled,
        elapsedTime: state.completedSegments.elapsedTime + state.activeSegment.elapsedTime,
        segments: [ ...state.completedSegments.segments, state.activeSegment]
      }
      state.activeSegment = null
      state.isTracking = false
    },
    updateElapsedTime: (state, { payload }) => {
      const { total } = payload

      state.activeSegment.elapsedTime = total / 1000
      state.totalElapsedTime = state.completedSegments.elapsedTime + state.activeSegment.elapsedTime
    },
    updateLocation: (state, { payload }) => {
      const { location } = payload
      const { coords, timestamp } = location

      const previousCoords = getLast(state.activeSegment.path)
      if(previousCoords) {
        console.log(`Distance traveled: ${computeDistance(previousCoords, coords)}`)
        state.activeSegment.distanceTraveled += computeDistance(previousCoords, coords)
      }

      state.region = {
        ... state.region,
        ... coords,
      }
      state.activeSegment.path.push(coords)
      state.totalDistanceTraveled = state.completedSegments.distanceTraveled + state.activeSegment.distanceTraveled
    },
  }
})

export const { startActivitySegment, stopActivitySegment, updateElapsedTime, updateLocation, } = activitySlice.actions
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
