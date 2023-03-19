import React, { useEffect, } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useForegroundPermissions } from 'expo-location'
import { useDispatch, useSelector } from 'react-redux'

import { startActivitySegment, stopActivitySegment, } from './activity'
import { finishActivity, startActivity } from './activitySlice'
import { startLocationTracking, stopLocationTracking, } from './location-update-saga'
import { startTimer, stopTimer, } from './timer-update-saga'

export function RecordExercise() {
  const [ status, requestPermission ] = useForegroundPermissions()
  const dispatch = useDispatch()
  const { activity, location: { currentLocation, } } = useSelector(s => ({
    activity: s.activity,
    newActivity: s.newActivity,
    location: s.location,
  }))
  const { 
    activeSegment,
    completedSegments, 
    isTracking,
    region,
    totalDistanceTraveled,
    totalElapsedTime,
  } = activity

  const rawSeconds = totalElapsedTime.toFixed(1)
  const minutes = Math.floor(rawSeconds / 60)
  const seconds = rawSeconds % 60

  const averageSpeed = totalDistanceTraveled > 0 ? (totalDistanceTraveled / rawSeconds) * 3600 : 0

  // console.log(isTracking)
  // alert(JSON.stringify(status))

  const startActivityTracking = async () => {    
    dispatch(startActivitySegment())
    dispatch(startLocationTracking())
    dispatch(startTimer())
    dispatch(startActivity({
      startTime: Date.now(),
      initialLocation: currentLocation,
    }))
  }

  const finishActivityTracking = async () => {
    dispatch(finishActivity({
      endTime: Date.now(),
      finalLocation: currentLocation,
    }))
    dispatch(stopTimer())
    dispatch(stopLocationTracking())
  }

  const pauseActivityTracking = async () => {
    console.log('Pausing...')
  }

  useEffect(() => {
    const g = async () => {
      const result = await requestPermission()
    }

    console.log(status)
    if(!status?.granted) {
      g()
    }
  }, [status])


  return (
      <View style={styles.container}>
        <MapView
          region={region}
          style={styles.map}
          followsUserLocation={true}
          showsUserLocation={true}
        >
          {completedSegments.segments.map(({ path }, i) => (
            <Polyline
              key={i}
              coordinates={path}
              strokeWidth={3}
            />
          ))}
          <Polyline coordinates={activeSegment?.path} strokeWidth={3} />
        </MapView>

        <View style={styles.controlsContainer}>
        { isTracking ? (
          <>
            <TouchableOpacity
              onPress={pauseActivityTracking}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={finishActivityTracking}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
            </>
          ) : (
          <TouchableOpacity
            onPress={startActivityTracking}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        )}
        </View>

        <Text>Elapsed Time: {`${minutes}:${seconds.toFixed(1)}`}</Text>
        <Text>Total Distance: {totalDistanceTraveled.toFixed(2)} km</Text>
        <Text>Average Speed {averageSpeed.toFixed(0)} km/hr</Text>

        <StatusBar style="auto" />
      </View>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  controlsContainer: {
    flex: 0,
    height: 250,
  },
  button: {
    backgroundColor: "blue",
    padding: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
  },
  map: {
    flexGrow: 1,
    borderColor: 'red',
    width: '100%',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
})
