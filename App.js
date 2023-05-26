import React, { useCallback, useEffect, useState, } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Provider, } from 'react-redux'

import Ionicons from '@expo/vector-icons/Ionicons'
import { StatusBar } from 'expo-status-bar'

import useColors from './external/pongo/hooks/useColors'
import useColorScheme from './external/pongo/hooks/useColorScheme'

import HomeScreen from './screens/Home'
import RecordActivityNavigator from './features/recordActivity/RecordActivityNavigator'
import SettingsNavigator from './features/settings/SettingsNavigator'
import useSplashScreen from './hooks/useSplashScreen'
import { useUrbitApi } from './hooks/useUrbitStore'

import { verifyConnection } from './features/urbitConnection/urbitConnection'


const Tab = createBottomTabNavigator()


export default function App() {
  const { appIsReady, onLayoutRootView, store } = useSplashScreen()
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()
  const { isConnected, } = useUrbitApi()

  console.log(isConnected)

  return appIsReady && (
    <NavigationContainer style={{ flex: 1 }}>
      <Provider store={store}>
        <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }} onLayout={onLayoutRootView}>
        <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
    
                if (route.name === 'Home') {
                  iconName = focused
                    ? 'home'
                    : 'home-outline';
                } else if (route.name === 'Record') {
                  iconName = focused ? 'ios-walk-sharp' : 'ios-walk-outline';
                } else if (route.name === 'Settings') {
                  iconName = focused ? 'ios-settings-sharp' : 'ios-settings-outline';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#228b22',
              tabBarInactiveTintColor: 'gray',
            })}
          >
              <Tab.Screen name="Home" component={HomeScreen} screenOptions={{
                height: '100%',
              }} />
              <Tab.Screen name="Record" component={RecordActivityNavigator} options={{ headerShown: false, }} />
              <Tab.Screen name="Settings" component={SettingsNavigator} options={{ headerShown: false, }} />
            </Tab.Navigator>
          <StatusBar translucent style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaProvider>
      </Provider>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
