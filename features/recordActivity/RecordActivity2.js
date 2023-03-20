import React, { useEffect, } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useForegroundPermissions } from 'expo-location'
import { useDispatch, useSelector } from 'react-redux'

import { finishActivity, pauseActivity, resumeActivity, startActivity } from './activitySlice'
import { startLocationTracking, stopLocationTracking, } from './location-update-saga'
import { startTimer, stopTimer, } from './timer-update-saga'
import activity from './activity'


export default function RecordActivity() {
  const dispatch = useDispatch()
  const { activity, location: { currentLocation }, } = useSelector(s => ({
    activity: s.activity,
    location: s.location,
  }))
  const { completedSegments, currentSegment, elapsedTime, isComplete, isPaused, isStarted, totalDistance, } = activity

  const rawSeconds = elapsedTime.toFixed(1) / 1000
  const minutes = Math.floor(rawSeconds / 60)
  const seconds = rawSeconds % 60

  useEffect(() => {
    dispatch(startLocationTracking())
  }, [])

  const finishActivityTracking = () => {
    dispatch(finishActivity({
      finishTime: Date.now(),
      finishLocation: currentLocation,
    }))
    dispatch(stopTimer())
    dispatch(stopLocationTracking())
  }

  const pauseActivityTracking = () => {
    dispatch(pauseActivity({
      pauseTime: Date.now(),
      pauseLocation: currentLocation,
    }))
  }

  const resumeActivityTracking = () => {
    dispatch(resumeActivity({
      startTime: Date.now(),
      initialLocation: currentLocation,
    }))
  }

  const startActivityTracking = () => {
    dispatch(startTimer())
    dispatch(startActivity({
      startTime: Date.now(),
      initialLocation: currentLocation,
    }))
  }

  return (<>
    <View style={styles.container}>
      <MapView
        style={styles.map}
        followsUserLocation={!isComplete}
        showsUserLocation={!isComplete}
      >
        {completedSegments.map((segment, i) => (
          <Polyline
            key={i}
            coordinates={segment.locationEntries}
            strokeWidth={3}
          />
        ))}
        {currentSegment && <Polyline coordinates={currentSegment.locationEntries} strokeWidth={3} />}
      </MapView>

      <View style={styles.controlsContainer}>
      { !isStarted
        ? (
          <TouchableOpacity
            onPress={startActivityTracking}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : isPaused 
          ? (<>
            <TouchableOpacity
              onPress={resumeActivityTracking}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={finishActivityTracking}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Finish</Text>
            </TouchableOpacity>
          </>) : (<>
            <TouchableOpacity
              onPress={pauseActivityTracking}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          </>)
      }
      </View>

      <Text>Elapsed Time: {`${minutes}:${seconds.toFixed(1)}`}</Text>
      <Text>Total Distance: {totalDistance.toFixed(2)} km</Text>
    </View>
  </>)
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

