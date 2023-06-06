import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { SafeAreaProvider } from "react-native-safe-area-context"

import { getMapInfoForCompletedActivity, } from '../../util/mapUtils'

import { useAllActivities, } from '../allActivities/useActivitiesStore' 


export default function DashboardView() {
  const activities = useAllActivities()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <LatestActivity activity={activities[0]} />
      <View style={{ flexGrow: 1, width: '100%', }}>
        <Text>Details</Text>
      </View>
    </View>
  )
}

export function LatestActivity({ activity }) {
  const { mapSegments, region, } = getMapInfoForCompletedActivity(activity)
  return (
    <View style={{ flexGrow: 0, width: '100%', }}>
      <Text>Latest Activity</Text>
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
    flexGrow: 0,
    borderColor: 'red',
    height: '50%',
    width: '100%',
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
})
