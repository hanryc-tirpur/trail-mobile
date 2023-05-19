import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SettingsScreen from './Settings'
import UnitSettings from './UnitSettings'
import UrbitSettings from './UrbitSettings'


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
        component={UrbitSettings}
        title="Urbit"
        options={{ headerTitle: 'Urbit' }}
      />
      <Stack.Screen
        name="UnitSettings"
        component={UnitSettings}
        title="Units"
        options={{ headerTitle: 'Units' }}
      />
    </Stack.Navigator>
  )
}
