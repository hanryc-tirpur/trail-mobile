import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Polyline } from 'react-native-maps'

import { getMapInfoForCompletedActivity, } from '../../util/mapUtils'

import ActivityTypeSelector from '../recordActivity/ActivityTypeSelector'
import { useSavedActivity } from '../allActivities/useActivitiesStore'


export default function ViewCompletedActivityScreen({ navigation, route }) {
  const activity = route.params.id && useSavedActivity(route.params .id)
  const { activityName, activityType } = activity
  const { mapSegments, region, } = getMapInfoForCompletedActivity(activity)
  const doChangeActivity = () => {}

  return (<View style={styles.screen}>
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.activityNameContainer}>
          <Text style={styles.activityNameLabel}>{activity.activityName}</Text>
        </View>
        <ActivityTypeSelector {... { activityType, doChangeActivity }} />
      </View>
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
      <Text>{JSON.stringify(activity)}</Text>
    </View>
  </View>)
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
  map: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },

  progressContainer: {
    flex: 2,
    width: '100%',
  },
  activityNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 5,
    width: '100%',
    height: 50,
  },
  activityNameLabel: {
    color: '#158445',
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
})

