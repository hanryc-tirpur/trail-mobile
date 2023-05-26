import React, { useEffect, } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useBackgroundPermissions, useForegroundPermissions } from 'expo-location'

import { initTracking } from './locationChannel'

import RecordActivity from './RecordActivity'


export default function RecordActivityScreen({ navigation }) {
  const [foregroundStatus, requestForegroundPermission] = useForegroundPermissions()
  const [backgroundStatus, requestBackgroundPermission] = useBackgroundPermissions()

  useEffect(() => {
    async function getLocationPermissions() {
      if(!foregroundStatus?.granted) {
        await requestForegroundPermission()
      }
      if(foregroundStatus?.granted && !backgroundStatus?.granted) {
        await requestBackgroundPermission()
      }
      if(foregroundStatus?.granted && backgroundStatus?.granted) {
        await initTracking()
      }
    }
    getLocationPermissions()
  }, [foregroundStatus?.status, backgroundStatus?.status])

  return foregroundStatus?.granted && backgroundStatus?.granted
    ? (<RecordActivity navigation={navigation} />)
    : (<>
      <View style={styles.container}>
        <Text>
          To record your activity, you must allow location permissions.
          To avoid having this check done every time, please select the "Allow While Using App"
          option.
        </Text>
      </View>
    </>)
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
})
