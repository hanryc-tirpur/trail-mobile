import React, { useEffect, useState, } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import {
  MaterialCommunityIcons
} from '@expo/vector-icons'

import { getZeroDistance } from '../../util/distanceCalculator'
import { toDistanceText } from '../../formatting/distance'

import { useDistanceUnit } from '../settings/hooks/useDistanceUnit'
import { useViewActivityActions } from '../viewActivity/useVewActivityStore'

import {
  changeActivityType,
  changeDistanceUnits,
  finishActivity,
  pauseActivity,
  resumeActivity,
  startActivity,
} from './activitySlice'
import { startLocationTracking } from './location-update-saga'
import { startTimer } from './timer-update-saga'
import { ActivityType } from './recordingActivityTypes'
import ActivityName from './ActivityName'


export default function RecordActivity({ navigation }) {
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const [distanceUnit] = useDistanceUnit()
  const { viewActivity } = useViewActivityActions()
  const { activity: activitySlice, location: { currentLocation }, } = useSelector(s => ({
    activity: s.activity,
    location: s.location,
  }))
  const {
    isComplete,
    isPaused,
    isStarted,
    activity,
  } = activitySlice
  const {
    activityType,
    completedSegments,
    currentSegment,
    startTime,
    timeActive,
    timeElapsed,
    totalDistance,
  } = activity


  useEffect(() => {
    dispatch(startLocationTracking())
    dispatch(changeDistanceUnits())
  }, [])

  useEffect(() => {
    if(isComplete) {
      console.log('viewing activity', activity)
      viewActivity(activity)
      navigation.navigate('RecordActivityViewActivity')
    }
  }, [isComplete])

  const finishActivityTracking = () => {
    dispatch(pauseActivity({
      pauseTime: Date.now(),
      pauseLocation: currentLocation,
    }))
    dispatch(finishActivity())
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
    distance: getZeroDistance(),
    startTime: now,
  }

  const getActivityTypeStyle = buttonType => buttonType !== activityType
    ? [styles.activityTypeSelector]
    : [styles.activityTypeSelector, styles.selectedActivityType]

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
        <ActivityName />
        <View style={styles.activityTypeContainer}>
          <TouchableOpacity
            style={getActivityTypeStyle(ActivityType.Walk)}
            onPress={() => dispatch(changeActivityType(ActivityType.Walk))}
          >
            <MaterialCommunityIcons
              color={activityType === ActivityType.Walk ? '#fff' : '#158445'}
              name="walk"
              size={32}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={getActivityTypeStyle(ActivityType.Run)}
            onPress={() => dispatch(changeActivityType(ActivityType.Run))}
          >
            <MaterialCommunityIcons
              color={activityType === ActivityType.Run ? '#fff' : '#158445'}
              name="run-fast"
              size={32}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={getActivityTypeStyle(ActivityType.Ride)}
            onPress={() => dispatch(changeActivityType(ActivityType.Ride))}
          >
            <MaterialCommunityIcons
              color={activityType === ActivityType.Ride ? '#fff' : '#158445'}
              name="bike-fast"
              size={32}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.segmentContainer}>
          <View style={styles.segmentNumbersContainer}>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.totalsLabel}>Segment Distance</Text>
              <Text style={styles.segmentNumbers}>{toDistanceText(effectiveSegment.distance)}</Text>
            </View>
            <View style={{ flexGrow: 1 }}>
              <Text style={styles.totalsLabel}>Segment Time</Text>
              <Text style={styles.segmentNumbers}>{formatTimespan(now - effectiveSegment.startTime)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.totalsContainer}>
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.totalsLabel}>Total Distance</Text>
            <Text style={styles.fixedNumbers}>{toDistanceText(totalDistance)}</Text>
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
  borderColor: '#158445',
  borderRadius: 20,
  borderWidth: 2,
  marginLeft: 25,
  marginRight: 25,
  padding: 10,
}
const actionButton = {
  ... buttonStyle,
}
const secondaryButton = {
  ... buttonStyle,
  backgroundColor: "#158445",
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
    marginLeft: 25,
    marginRight: 25,
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
    flex: 6,
    marginRight: 0,
  },
  secondaryButton: {
    ... secondaryButton,
    flex: 4,
  },
  secondaryButtonText: {
    ... buttonTextStyle,
    color: '#fff',
  },
  buttonText: {
    ... buttonTextStyle,
    color: '#158445',
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


  multiButton: {
    flexDirection: 'row',
  },

  activityTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingTop: 10,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
  },
  activityTypeSelector: {
    alignItems: 'center',
    borderColor: '#158445',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  selectedActivityType: {
    backgroundColor: '#158445',
    color: '#fff',
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

