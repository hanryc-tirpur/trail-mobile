import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import SettingsScreen from './Settings'
import LoginScreen from '../../external/pongo/screens/Login'


const Stack = createNativeStackNavigator()


export default function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="ConnectYourUrbit" component={LoginScreen} title="Urbit" />
    </Stack.Navigator>
  )
}
