import React, { useEffect, } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useForegroundPermissions } from 'expo-location'
import { useDispatch, useSelector } from 'react-redux'

import { finishActivity, pauseActivity, resumeActivity, startActivity } from './activitySlice'
import { startLocationTracking, stopLocationTracking, } from './location-update-saga'
import { startTimer, stopTimer, } from './timer-update-saga'


export default function RecordActivity() {
  const dispatch = useDispatch()
  const { activity, location: { currentLocation }, } = useSelector(s => ({
    activity: s.activity,
    location: s.location,
  }))
  const {
    activityTime,
    completedSegments,
    currentSegment,
    elapsedTime,
    isComplete,
    isPaused,
    isStarted,
    startTime,
    totalDistance,
  } = activity

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
        <View style={{ flexDirection:"row", width: '100%', }}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{formatTimespan(elapsedTime)}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{`${totalDistance.toFixed(2)} km`}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{formatTimespan(activityTime)}</Text>
          </View>
        </View>
      { currentSegment && (
        <View style={{ flexDirection:"row", width: '100%', fontVariant: ["tabular-nums"] }}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{formatTimespan(currentSegment.startTime - startTime)}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{`${currentSegment.distance.toFixed(2)} km`}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.fixedNumbers}>{formatTimespan(Date.now() - currentSegment.startTime)}</Text>
          </View>
        </View>
      )}
      { [... completedSegments].reverse().map((seg, i) => {
        return (
          <View style={{ flexDirection:"row", width: '100%', fontVariant: ["tabular-nums"] }} key={i}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.fixedNumbers}>{formatTimespan(seg.startTime - startTime)}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.fixedNumbers}>{`${seg.distance.toFixed(2)} km`}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.fixedNumbers}>{formatTimespan(seg.endTime - seg.startTime)}</Text>
            </View>
          </View>
        )
      })}
      </View>
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
  fixedNumbers: {
    fontVariant: ['tabular-nums'] 
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


function formatTimespan(timespanMs) {
  const msPerHour = 60 * 60 * 1000
  const msPerMin = 60 * 1000
  const msPerSec = 1000
  const hours = Math.floor(timespanMs / msPerHour)
  timespanMs -= hours * msPerHour
  const minutes = Math.floor(timespanMs / msPerMin)
  timespanMs -= minutes * msPerMin
  const seconds = Math.floor(timespanMs / msPerSec)
  timespanMs -= seconds * msPerSec
  const msDigit = Math.floor(timespanMs / 100)

  return `${padZeroes(minutes)}:${padZeroes(seconds)}.${msDigit}`
}

function padZeroes(num) {
  const numStr = num.toString()
  return numStr.length === 1 ? `0${numStr}` : numStr
}

