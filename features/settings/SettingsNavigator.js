import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SettingsScreen from './Settings'
import LoginScreen from '../../external/pongo/screens/Login'


const Stack = createNativeStackNavigator()


export default function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsContent"
        component={SettingsScreen}
        title="Settings"
        options={{ headerTitle: 'Settings' }}
      />
      <Stack.Screen
        name="ConnectYourUrbit"
        component={LoginScreen}
        title="Urbit"
        options={{ headerTitle: 'Urbit' }}
      />
    </Stack.Navigator>
  )
}
