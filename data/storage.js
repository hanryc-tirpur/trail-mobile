import AsyncStorage from '@react-native-async-storage/async-storage'

const activitiesKey = 'activities'


export async function loadActivities() {
  const storeData = await migrateStore()
  return storeData.unsavedActivities
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
    return currentState
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
  const fromDb = await AsyncStorage.getItem('activities')
  const activities = fromDb === null ? [] : JSON.parse(fromDb)
  const toSave = [
    ... activities,
    activity,
  ]
  await save(toSave)
}
