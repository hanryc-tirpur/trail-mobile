import React, { useEffect, } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { useForegroundPermissions } from 'expo-location'
import { connect, useDispatch } from 'react-redux'

import { startActivitySegment, stopActivitySegment, } from '../reducers/activity'

export function RecordExercise({ activity, }) {
  const { 
    activeSegment,
    completedSegments, 
    isTracking,
    region,
    totalDistanceTraveled,
    totalElapsedTime,
  } = activity
  const [ status, requestPermission ] = useForegroundPermissions()
  const dispatch = useDispatch()

  const rawSeconds = totalElapsedTime.toFixed(1)
  const minutes = Math.floor(rawSeconds / 60)
  const seconds = rawSeconds % 60

  const averageSpeed = totalDistanceTraveled > 0 ? (totalDistanceTraveled / rawSeconds) * 3600 : 0

  // console.log(isTracking)
  // alert(JSON.stringify(status))

  let openImagePickerAsync = async () => {    
    dispatch(startActivitySegment())
    dispatch({
      type: 'location/start-track-position'
    })
    dispatch({
      type: 'timer/start-segment-timer'
    })
  }

  const stopLocationTracking = async () => {
    dispatch(stopActivitySegment())
    dispatch({
      type: 'location/stop-track-position'
    })
    dispatch({
      type: 'timer/stop-segment-timer'
    })
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
        >
          {completedSegments.segments.map(({ path }, i) => (
            <Polyline
              key={i}
              coordinates={path}
              strokeWidth={5}
            />
          ))}
          <Polyline coordinates={activeSegment?.path} strokeWidth={5} />
        </MapView>

        <View style={styles.controlsContainer}>
        { isTracking ? (
          <TouchableOpacity
            onPress={stopLocationTracking}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>)
          : (
          <TouchableOpacity
            onPress={openImagePickerAsync}
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

export default connect(s => ({
  activity: s.activity,
}))(RecordExercise)

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
