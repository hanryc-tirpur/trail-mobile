import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { SafeAreaProvider } from "react-native-safe-area-context"
import polyline from '@mapbox/polyline'
import bbox from '@turf/bbox'
import center from '@turf/center'

import useColors from '../external/pongo/hooks/useColors'
import useColorScheme from '../external/pongo/hooks/useColorScheme'
import useStore from '../external/pongo/state/useStore'
import { useEffect } from 'react'
import { useUrbitConnection } from '../hooks/useUrbitStore'
import { scry } from '../data/urbitApiSaga'
import { useAllActivities, } from '../features/allActivities/useActivitiesStore' 
import { getMapInfoForCompletedActivity, } from '../util/mapUtils'

export default function HomeScreen() {
  const { loading, setLoading, ship: self, shipUrl, authCookie, loadStore, needLogin, setNeedLogin, setShip, addShip } = useStore()
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()
  const { isConnected } = useUrbitConnection()
  const activities = useAllActivities()

  const hasActivities = (activities || []).length !== 0

  useEffect(() => {
    async function getIt() {
      try {
        const acts = await scry({
          app: 'trail',
          path: '/activities/all',
        })
        console.log('from server', acts)
      } catch (ex) {
        console.log('Could not fetch latest activities', ex)
      }
    }
    if(isConnected) {
      getIt()
    }
  }, [isConnected])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
        { hasActivities
          ? (<LatestActivity activity={activities[0]} />)
          : (
            <View style={{ flexGrow: 0, width: '100%', }}>
              <Text>Record an activity!</Text>
            </View>
          )
        }
        <View style={{ flexGrow: 1, width: '100%', }}>
          <Text>Details</Text>
        </View>
      </SafeAreaProvider>
    </View>
  )
}

function LatestActivity({ activity }) {
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
