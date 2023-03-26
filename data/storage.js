import AsyncStorage from '@react-native-async-storage/async-storage'

export async function loadActivities() {
  const fromDb = await AsyncStorage.getItem('activities')
  return JSON.parse(fromDb)
}

export async function saveActivity(activity) {
  const fromDb = await AsyncStorage.getItem('activities')
  const activities = fromDb === null ? [] : JSON.parse(fromDb)
  const toSave = [
    ... activities,
    activity,
  ]
  await AsyncStorage.setItem('activities', JSON.stringify(toSave))
}
