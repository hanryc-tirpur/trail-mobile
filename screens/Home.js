import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { SafeAreaProvider } from "react-native-safe-area-context"
import polyline from '@mapbox/polyline'
import bbox from '@turf/bbox'
import center from '@turf/center'

import useColors from '../external/pongo/hooks/useColors'
import useColorScheme from '../external/pongo/hooks/useColorScheme'
import useStore from '../external/pongo/state/useStore'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useUrbitConnection } from '../hooks/useUrbitStore'
import { scry } from '../data/urbitApiSaga'
import useAllActivities from '../hooks/useAllActivities'
import { useActivitiesActions } from '../features/allActivities/useActivitiesStore' 
import { toCompletedActivity } from '../util/activityConverter'

export default function HomeScreen() {
  const { loading, setLoading, ship: self, shipUrl, authCookie, loadStore, needLogin, setNeedLogin, setShip, addShip } = useStore()
  const { activities } = useSelector(s => s.activities)
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()
  const { isConnected } = useUrbitConnection()

  const hasActivities = (activities || []).length !== 0

  function getMapProps() {
    const { completedSegments } = activities[activities.length - 1]
    const allCoords = completedSegments.reduce((all, seg) => {
      return [
        ... all,
        ... seg.locationEntries.map(l => [l.latitude, l.longitude])
      ]
    }, [])
    const encoded = polyline.encode(allCoords)
    const geo = polyline.toGeoJSON(encoded)
    const box = bbox(geo)
    const cen = center(geo)
    const region = {
      latitude: cen.geometry.coordinates[1],
      longitude: cen.geometry.coordinates[0],
      latitudeDelta: Math.abs(box[1] - box[3]) * 2,
      longitudeDelta: Math.abs(box[0] - box[2]) * 2,
    }
    return { completedSegments, region }
  }

  useEffect(() => {
    async function getIt() {
      const acts = await scry({
        app: 'trail',
        path: '/activities/all',
      })
      console.log('from server', acts)
    }
    if(isConnected) {
      getIt()
    }
  }, [isConnected])

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
        { hasActivities
          ? (<LatestActivity {... getMapProps()} />)
          : (
            <View style={{ flexGrow: 0, width: '100%', }}>
              <Text>Record an activity!</Text>
            </View>
          )
        }
        <View style={{ flexGrow: 1, width: '100%', }}>
          <Text>Details</Text>
          <MigrateData />
        </View>
      </SafeAreaProvider>
    </View>
  )
}

function LatestActivity({ completedSegments, region, }) {
  return (
    <View style={{ flexGrow: 0, width: '100%', }}>
      <Text>Latest Activity</Text>
      <MapView
        style={styles.map}
        region={region}
      >
        {completedSegments.map((segment, i) => (
          <Polyline
            key={i}
            coordinates={segment.locationEntries}
            strokeWidth={3}
          />
        ))}
      </MapView>
    </View>
  )
}

function MigrateData() {
  const [hasActivities, allActivities] = useAllActivities()
  const { addUnsyncedActivity } = useActivitiesActions()

  const migrateActivities = () => {
    allActivities.unsavedActivities
      .map(toCompletedActivity)
      .forEach(act => addUnsyncedActivity(act))
  }

  return (
    hasActivities && <View>
      <Text>
        You have {allActivities.length} activities to migrate.
      </Text>
      <TouchableOpacity
        onPress={migrateActivities}
      >
        <Text>Migrate</Text>
      </TouchableOpacity>
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
