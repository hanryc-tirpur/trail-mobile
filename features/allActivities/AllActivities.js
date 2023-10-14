import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple'
import { useNavigation } from '@react-navigation/native'

import { useAllActivities } from './useActivitiesStore'
import { formatTimespan, toActivityDate } from '../../util/formatting'
import { toDistanceText } from '../../formatting/distance'


export const createNavigateToActivity = navigation => id => navigation.navigate('Activities', {
  screen: 'CompletedActivity',
  params: { id },
})

function ActivitySummary(activity) {
  const navigation = useNavigation()
  const navigateToActivity = createNavigateToActivity(navigation)

  return (
    <Cell
      cellStyle="Basic"
      accessory="DisclosureIndicator"
      onPress={() => navigateToActivity(activity.id)}
      cellContentView={(<ActivitySummaryContent activity={activity} />)}
    />
  )
}

function ActivitySummaryContent({ activity }) {
  return (
    <View style={styles.summaryContent}>
      <Text style={styles.activityName}>{activity.name}</Text>
      <Text>{toActivityDate(activity.id)}</Text>
      <Text>{`Traveled ${toDistanceText(activity.totalDistance)} in ${formatTimespan(activity.timeActive)}`}</Text>
    </View>
  )
}


export default function AllActivities() {
  const activities = useAllActivities()

  return (<ScrollView contentContainerStyle={styles.stage}>
    <TableView>
      {activities.map(a => (<ActivitySummary key={a.id} {... a} />))}
    </TableView>
  </ScrollView>)
}

const styles = StyleSheet.create({
  activityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
  summaryContent: {
    marginBottom: 5,
    marginTop: 5,
    width: '95%',
  },
});
