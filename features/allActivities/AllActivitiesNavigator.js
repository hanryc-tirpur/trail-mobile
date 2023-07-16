
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import AllActivities from './AllActivities'


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
    </Stack.Navigator>
  )
}

