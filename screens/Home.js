import { StyleSheet, Text, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'
import { SafeAreaProvider } from "react-native-safe-area-context"
import polyline from '@mapbox/polyline'
import bbox from '@turf/bbox'
import center from '@turf/center'

import useColors from '../external/pongo/hooks/useColors'
import useColorScheme from '../external/pongo/hooks/useColorScheme'
import useStore from '../external/pongo/state/useStore'
import { useSelector } from 'react-redux'


export default function HomeScreen() {
  const { loading, setLoading, ship: self, shipUrl, authCookie, loadStore, needLogin, setNeedLogin, setShip, addShip } = useStore()
  const { activities } = useSelector(s => s.activities)
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()

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

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
        <View style={{ flexGrow: 0, width: '100%', }}>
          <Text>Latest Activity</Text>
          <MapView
            style={styles.map}
            initialRegion={region}
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
        <View style={{ flexGrow: 1, width: '100%', }}>
          <Text>Details</Text>
        </View>
      </SafeAreaProvider>
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
