import { createSlice } from '@reduxjs/toolkit'

interface ActivityState {
  isComplete: boolean,
  isPaused: boolean,
  isStarted: boolean,

  activity: ActivityData,
}

interface ActivityData {
  activityType?: ActivityType,
  name?: string,
  timeActive: number,
  timeElapsed: number,
  endTime?: number,
  startTime: number,
  totalDistance: number,

  completedSegments: CompletedSegment[],
  currentSegment: ActivitySegment | null,
}

enum ActivityType {
  Ride = 'ride',
  Run = 'run',
  Walk = 'walk',
}

interface ActivitySegment {
  distance: number,
  startTime: number,

  locationEntries: LocationEntry[],
}

interface CompletedSegment extends ActivitySegment {
  endTime: number,
}

interface LocationEntry {
  latitude: number,
  longitude: number,
}


const initialState: ActivityState = {
  isComplete: false,
  isPaused: false,
  isStarted: false,

  activity: {
    completedSegments: [],
    currentSegment: null,
    timeActive: 0,
    timeElapsed: 0,
    startTime: 0,
    totalDistance: 0,
  }
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    finishActivity: (state) => {
      state.isComplete = true
      state.isPaused = false
    },
    pauseActivity: (state, action) => {
      const { pauseTime, pauseLocation, } = action.payload
      const { activity } = state

      if(activity.currentSegment === null) {
        throw Error('currentSegment should not be null here.')
      }

      state.isPaused = true
      activity.completedSegments.push({
        ... activity.currentSegment,
        locationEntries: [
          ... activity.currentSegment.locationEntries,
          pauseLocation.coords,
        ],
        endTime: pauseTime,
      })
      state.activity.currentSegment = null
    },
    resumeActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload
      const { activity } = state

      state.isPaused = false
      activity.currentSegment = {
        distance: 0,
        locationEntries: [initialLocation.coords],
        startTime,
      }
    },
    startActivity: (state, action) => {
      const { startTime, initialLocation, } = action.payload
      const { activity } = state

      state.isStarted = true
      activity.startTime = startTime
      activity.currentSegment = {
        distance: 0,
        locationEntries: [initialLocation.coords],
        startTime,
      }
    },
    timerTick: (state) => {
      const tickTime = Date.now()
      const { activity } = state
      activity.timeElapsed = tickTime - activity.startTime

      const currentSegTime = !activity.currentSegment ? 0 : tickTime - activity.currentSegment.startTime
      activity.timeActive = activity.completedSegments.reduce((sum, seg) => {
        return sum + (seg.endTime - seg.startTime)
      }, currentSegTime)
    },
    updateLocation: (state, { payload }) => {
      if(!state.isStarted || state.isPaused || state.isComplete) {
        return state
      }

      const { activity } = state
      if(activity.currentSegment === null) {
        throw Error('currentSegment should not be null when location is updating')
      }
      const { location } = payload
      const { coords, timestamp } = location
      const previousCoords = getLast(activity.currentSegment.locationEntries)

      const distance = computeDistance(previousCoords, coords)
      if(isNaN(distance)) {
        return state
      }

      activity.currentSegment.distance += distance
      activity.currentSegment.locationEntries.push(coords)

      activity.totalDistance = activity.completedSegments.reduce((sum, seg) => {
        return sum += seg.distance
      }, activity.currentSegment.distance)
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


export function computeDistance({ latitude: prevLat, longitude: prevLong }: LocationEntry, { latitude: lat, longitude: long }: LocationEntry) {
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

function toRad(angle: number) {
  return (angle * Math.PI) / 180
}

function getLast<T>(arr: T[]) {
  return arr[arr.length - 1]
}

