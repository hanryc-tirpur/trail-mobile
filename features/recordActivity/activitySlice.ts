import { createSlice } from '@reduxjs/toolkit'

import { Distance, addDistances, computeDistance, convertDistance, getZeroDistance, } from '../../util/distanceCalculator'

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
  totalDistance: Distance,

  completedSegments: CompletedSegment[],
  currentSegment: ActivitySegment | null,
}

enum ActivityType {
  Ride = 'ride',
  Run = 'run',
  Walk = 'walk',
}

interface ActivitySegment {
  distance: Distance,
  startTime: number,

  locationEntries: LocationEntry[],
}

interface CompletedSegment extends ActivitySegment {
  endTime: number,
}

export interface LocationEntry {
  latitude: number,
  longitude: number,
}


function createInitialState(): ActivityState {
  return {
    isComplete: false,
    isPaused: false,
    isStarted: false,

    activity: {
      completedSegments: [],
      currentSegment: null,
      timeActive: 0,
      timeElapsed: 0,
      startTime: 0,
      totalDistance: getZeroDistance(),
    }
  }
}

export const activitySlice = createSlice({
  name: 'activity',
  initialState: createInitialState(),
  reducers: {
    resetRecorder: (state) => {
      return {
        ... state,
        ... createInitialState(),
      }
    },
    finishActivity: (state) => {
      state.isComplete = true
    },
    changeDistanceUnits: (state) => {
      const { activity } = state
      state.activity.totalDistance = convertDistance(activity.totalDistance)
      if(state.activity.currentSegment) {
        state.activity.currentSegment.distance = convertDistance(state.activity.currentSegment.distance)
      }
      state.activity.completedSegments = activity.completedSegments.map(seg => ({
        ... seg,
        distance: convertDistance(seg.distance),
      }))
    },
    pauseActivity(state, { payload }) {
      if(state.isPaused) return state

      const { pauseTime, pauseLocation, } = payload
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

      state.isComplete = false
      state.isPaused = false
      activity.currentSegment = {
        distance: getZeroDistance(),
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
        distance: getZeroDistance(),
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
      if(isNaN(distance.val)) {
        return state
      }

      activity.currentSegment.distance = addDistances(activity.currentSegment.distance, distance)
      activity.currentSegment.locationEntries.push(coords)

      activity.totalDistance = activity.completedSegments.reduce((sum, seg) => {
        return addDistances(sum, seg.distance)
      }, activity.currentSegment.distance)
    },
  },
})


// Action creators are generated for each case reducer function
export const {
  finishActivity,
  changeDistanceUnits,
  pauseActivity,
  resetRecorder,
  resumeActivity,
  startActivity,
  timerTick,
  updateLocation,
} = activitySlice.actions

export default activitySlice.reducer


function getLast<T>(arr: T[]) {
  return arr[arr.length - 1]
}

