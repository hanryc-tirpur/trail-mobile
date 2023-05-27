import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'

import { useActivitiesActions } from '../allActivities/useActivitiesStore'
import { resetRecorder } from '../recordActivity/activitySlice'
import { stopLocationTracking } from '../recordActivity/location-update-saga'
import { stopTimer } from '../recordActivity/timer-update-saga'
import { toCompletedActivity } from '../../util/activityConverter'
import { getBoundingRegionForActivity, getMapInfoForInProgressActivity } from '../../util/mapUtils'
import { useViewActivity, useViewActivityActions } from './useVewActivityStore'
import useRedirectOnNoActivity from './useRedirectOnNoActivity'
import { assertIsNotNull } from '../../util/assertions'


export default function ViewActivityScreen({ navigation }) {
  const dispatch = useDispatch()
  const { addUnsyncedActivity } = useActivitiesActions()
  const { clearActivity } = useViewActivityActions()
  const { activity } = useViewActivity()

  if(activity === null) return null

  const {
    completedSegments,
    currentSegment,
    startTime,
    timeActive,
    timeElapsed,
    totalDistance,
  } = activity || {}

  function discardViewedActivity() {
    resetRecorder()
    dispatch(stopLocationTracking())
    dispatch(stopTimer())
    clearActivity()
    navigation.navigate('RecordActivityScreen')
  }

  function saveViewedActivity() {
    assertIsNotNull(activity)
    console.log('Saving completed activity', toCompletedActivity(activity))
    addUnsyncedActivity(toCompletedActivity(activity))
    resetRecorder()
    dispatch(stopLocationTracking())
    dispatch(stopTimer())
    clearActivity()
    navigation.navigate('Home')
  }

  // @ts-ignore
  const { mapSegments, region } = getMapInfoForInProgressActivity(activity)
  return (<View style={styles.screen}>
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
        >
          {mapSegments.map((segment, i) => (
            <Polyline
              key={i}
              coordinates={segment.entries}
              strokeWidth={3}
            />
          ))}
        </MapView>
      </View>
    </View>
    <View style={styles.controlsContainer}>
      <View style={styles.multiButton}>
        <TouchableOpacity
          onPress={discardViewedActivity}
          style={styles.actionButton}
        >
          <Text style={styles.buttonText}>Discard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveViewedActivity}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
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
    flex: 4,
    marginRight: 0,
  },
  secondaryButton: {
    ... secondaryButton,
    flex: 6,
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

