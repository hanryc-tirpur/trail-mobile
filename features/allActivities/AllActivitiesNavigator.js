import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AllActivities from './AllActivities'
import ViewCompletedActivityScreen from '../viewCompletedActivity/ViewCompletedActivityScreen'


const Stack = createNativeStackNavigator()


export default function AllActivitiesNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AllActivitiesDisplay"
        component={AllActivities}
        title="Activities"
        options={{ headerTitle: 'Activities' }}
      />
      <Stack.Screen
        name="CompletedActivity"
        component={ViewCompletedActivityScreen}
        title="Completed"
        options={{ headerTitle: 'Completed' }}
      />
    </Stack.Navigator>
  )
}

