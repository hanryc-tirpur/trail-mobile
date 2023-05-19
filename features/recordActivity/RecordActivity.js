import React, { useEffect, } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'

import { pauseActivity, resumeActivity, startActivity } from './activitySlice'
import { startLocationTracking, stopLocationTracking, } from './location-update-saga'
import { finishActivitySaga } from './save-activity-saga'
import { startTimer, stopTimer, } from './timer-update-saga'
import { useDistanceUnit } from '../settings/hooks/useDistanceUnit'


export default function RecordActivity() {
  const dispatch = useDispatch()
  const [distanceUnit] = useDistanceUnit()
  const { activity: activitySlice, location: { currentLocation }, } = useSelector(s => ({
    activity: s.activity,
    location: s.location,
  }))
  const {
    isComplete,
    isPaused,
    isStarted,
    activity: {
      completedSegments,
      currentSegment,
      startTime,
      timeActive,
      timeElapsed,
      totalDistance,
    }
  } = activitySlice

  useEffect(() => {
    dispatch(startLocationTracking())
  }, [])

  const finishActivityTracking = () => {
    if(!isPaused) {
      dispatch(pauseActivity({
        pauseTime: Date.now(),
        pauseLocation: currentLocation,
      }))
    }
    dispatch(finishActivitySaga())
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

  const now = Date.now()
  const effectiveSegment = currentSegment || {
    distance: 0,
    startTime: now,
  }

  return (<View style={styles.screen}>
    <View style={styles.container}>
      <View style={styles.mapContainer}>
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
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.segmentContainer}>
          <Text style={styles.sectionHeader}>Segment</Text>
          <View style={styles.segmentNumbersContainer}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.totalsLabel}>Distance</Text>
              <Text style={styles.segmentNumbers}>{`${effectiveSegment.distance.toFixed(2)} ${distanceUnit}`}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.totalsLabel}>Active Time</Text>
              <Text style={styles.segmentNumbers}>{formatTimespan(now - effectiveSegment.startTime)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.totalsContainer}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.totalsLabel}>Total Distance</Text>
            <Text style={styles.fixedNumbers}>{`${totalDistance.toFixed(2)} ${distanceUnit}`}</Text>
          </View>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.totalsLabel}>Time Elapsed</Text>
            <Text style={styles.fixedNumbers}>{formatTimespan(timeElapsed)}</Text>
          </View>
        </View>
      </View>
    </View>
    <View style={styles.controlsContainer}>
    { !isStarted
      ? (
        <TouchableOpacity
          onPress={startActivityTracking}
          style={secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Start</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.multiButton}>
          { isPaused 
          ? (
            <TouchableOpacity
              onPress={resumeActivityTracking}
              style={styles.actionButton}
            >
              <Text style={styles.buttonText}>Resume</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={pauseActivityTracking}
              style={styles.actionButton}
            >
              <Text style={styles.buttonText}>Pause</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={finishActivityTracking}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      )
    }
    </View>
  </View>)
}


const buttonStyle = {
  borderColor: '#228b22',
  borderRadius: 20,
  borderWidth: 2,
  marginLeft: 10,
  marginRight: 10,
  padding: 10,
}
const actionButton = {
  ... buttonStyle,
}
const secondaryButton = {
  ... buttonStyle,
  backgroundColor: "#228b22",
}
const buttonTextStyle = {
  fontSize: 32,
  fontWeight: 'bold',
  textAlign: 'center',
  width: '100%',
}
const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  controlsContainer: {
    marginBottom: 10,
    width: '100%',
  },
  progressContainer: {
    flex: 2,
    width: '100%',
  },
  totalsContainer: {
    flexDirection: 'row',
    fontVariant: ['tabular-nums'],
    marginBottom: 25,
    marginLeft: 25,
    marginRight: 25,
    width: '100%',
  },
  segmentContainer: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
  },
  segmentNumbersContainer: {
    flex: 1,
    fontVariant: ['tabular-nums'],
    marginTop: 25,
    width: '100%',
  },
  segmentNumbers: {
    fontSize: 48,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
  fixedNumbers: {
    fontSize: 28,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
  actionButton: {
    ... actionButton,
    flex: 7,
    marginRight: 0,
  },
  secondaryButton: {
    ... secondaryButton,
    flex: 3,
  },
  secondaryButtonText: {
    ... buttonTextStyle,
    color: '#fff',
  },
  buttonText: {
    ... buttonTextStyle,
    color: '#228b22',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  totalsLabel: {
    fontSize: 24,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },

  sectionHeader: {
    fontSize: 32,
  },
  multiButton: {
    flexDirection: 'row',
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

