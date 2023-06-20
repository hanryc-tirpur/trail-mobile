import { useCallback, } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { ActivityType } from './recordingActivityTypes'


export default function ActivityTypeSelector({ activityType, doChangeActivity }) {
  const getActivityTypeStyle = useCallback(buttonType => buttonType !== activityType
    ? [styles.activityTypeSelector]
    : [styles.activityTypeSelector, styles.selectedActivityType]
  , [activityType])
  const getButtonColor = useCallback(buttonType => buttonType === activityType
    ? '#fff'
    : '#158445'
  , [activityType])

  return (
    <View style={styles.activityTypeContainer}>
      <ActivityTypeDisplay
        activityType={ActivityType.Walk}
        iconName="walk"
        {... { doChangeActivity, getActivityTypeStyle, getButtonColor }}
      />

      <ActivityTypeDisplay
        activityType={ActivityType.Run}
        iconName="run-fast"
        {... { doChangeActivity, getActivityTypeStyle, getButtonColor }}
      />

      <ActivityTypeDisplay
        activityType={ActivityType.Ride}
        iconName="bike-fast"
        {... { doChangeActivity, getActivityTypeStyle, getButtonColor }}
      />
    </View>
  )
}

const ActivityTypeDisplay = ({ activityType, doChangeActivity, getActivityTypeStyle, getButtonColor, iconName }) => {
  return (
    <TouchableOpacity
      style={getActivityTypeStyle(activityType)}
      onPress={() => doChangeActivity(activityType)}
    >
      <MaterialCommunityIcons
        color={getButtonColor(activityType)}
        name={iconName}
        size={32}
      />
    </TouchableOpacity>
  )
} 


const styles = StyleSheet.create({
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
