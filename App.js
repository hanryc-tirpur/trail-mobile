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
import useNetInfo from './hooks/useNetInfo'

import HomeScreen from './screens/Home'
import RecordActivityScreen from './features/recordActivity/RecordActivityScreen'
import SettingsNavigator from './features/settings/SettingsNavigator'
import useSplashScreen from './hooks/useSplashScreen'


const Tab = createBottomTabNavigator()


export default function App() {
  const { appIsReady, onLayoutRootView, store } = useSplashScreen()
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()

  return appIsReady && (
    <NavigationContainer>
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
                } else if (route.name === 'SettingsNavigator') {
                  iconName = focused ? 'ios-settings-sharp' : 'ios-settings-outline';
                }
    
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: 'tomato',
              tabBarInactiveTintColor: 'gray',
            })}
          >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Record" component={RecordActivityScreen} />
              <Tab.Screen name="SettingsNavigator" component={SettingsNavigator} options={{ headerShown: false, }} title="Settings" />
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
