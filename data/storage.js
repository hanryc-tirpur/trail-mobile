import AsyncStorage from '@react-native-async-storage/async-storage'
import { DistanceUnit } from '../util/distanceCalculator'

const activitiesKey = 'activities'


export async function loadActivities() {
  const storeData = await migrateStore()
  console.log('storage:loadActivities', storeData)
  return storeData.unsavedActivities
}

export async function loadAllActivities() {
  const storeData = await migrateStore()
  console.log('storage:loadAllActivities', storeData)
  return storeData
}

export async function loadUrbit() {
  const fromDb = await AsyncStorage.getItem('store')
  const urbit = fromDb === null ? [] : JSON.parse(fromDb) 
  console.log(urbit)
}

async function migrateStore() {
  const fromDb = await AsyncStorage.getItem(activitiesKey)
  if(fromDb === null) {
    const updatedState = defaultState()
    await save(defaultState())
    return updatedState
  }
  const currentState = JSON.parse(fromDb)
  if(!currentState.version) {
    const updatedState = {
      ... defaultState(),

      unsavedActivities: currentState,
    }
    await save(updatedState)
    return updatedState
  } else if(currentState.version === 1) {
    return {
      ... currentState,
      unsavedActivities: currentState.unsavedActivities.map(a => {
        return {
          ... a,
          name: !a.name ? 'Unnamed activity' : a.name,
          totalDistance: a.totalDistance.val ? a.totalDistance : {
            val: a.totalDistance,
            unit: DistanceUnit.Km,
          },
          completedSegments: a.completedSegments.map(seg => ({
            ... seg,
            distance: seg.distance.val ? seg.distance : {
              val: seg.distance,
              unit: DistanceUnit.Km,
            }
          }))
        }
      })
    }
  }
}

async function save(state) {
  return await AsyncStorage.setItem(activitiesKey, JSON.stringify(state))
}

function defaultState() {
  return {
    version: 1,
    unsavedActivities: [],
    savedActivities: [],
  }
}

export async function saveActivity(activity) {
  const fromDb = await AsyncStorage.getItem(activitiesKey)
  const state = JSON.parse(fromDb)
  const toSave = {
    ... state,
    unsavedActivities: [
      ... state.unsavedActivities,
      activity,
    ],
  }
  await save(toSave)
}
