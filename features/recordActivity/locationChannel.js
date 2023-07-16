import { eventChannel, } from 'redux-saga'
import { Accuracy, ActivityType, startLocationUpdatesAsync, stopLocationUpdatesAsync, watchPositionAsync } from 'expo-location'
import * as TaskManager from 'expo-task-manager'

const LOCATION_TASK_NAME = 'track-background-location'
const locationArgs = {
  accuracy: Accuracy.Highest,
  activityType: ActivityType.Fitness,
  distanceInterval: 5,
  foregroundService: {
    notificationBody: 'Gets activity location',
    notificationTitle: 'Gets activity location',
  }
}
let emitLocation
let cleanUpForeground
const cleanUpBackground = () => stopLocationUpdatesAsync(LOCATION_TASK_NAME)

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
  if (error) {
    console.log(error.message)
    return
  }

  if (data && emitLocation) {
    const { locations } = data
    locations
      .filter(loc => Boolean(loc))
      .forEach(loc => emitLocation(loc))
  }
})

export async function initTracking() {
  await startLocationUpdatesAsync(LOCATION_TASK_NAME, locationArgs)
  const subscription = await watchPositionAsync(locationArgs, location => {
    location && emitLocation && emitLocation(location)
  })
  cleanUpForeground = () => subscription.remove()
}

export const locationChannel = eventChannel(emitter => {
  emitLocation = loc => emitter(loc)

  return () => {
    cleanUpForeground && cleanUpForeground()
    cleanUpBackground()
  }
})

