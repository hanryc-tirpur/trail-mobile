import React, { useCallback, useEffect, useState, } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { Provider, } from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"

import Ionicons from '@expo/vector-icons/Ionicons'

const Tab = createBottomTabNavigator()
import createStore from './store'

import useColors from './external/pongo/hooks/useColors'
import useColorScheme from './external/pongo/hooks/useColorScheme'

import HomeScreen from './screens/Home'
import RecordActivityScreen from './features/recordActivity/RecordActivity'
import SettingsNavigator from './features/settings/SettingsNavigator'

SplashScreen.preventAutoHideAsync()


export default function App() {
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()
  const [ appIsReady, setAppIsReady ] = useState(false)
  const [ store, setStore ] = useState(null) 

  useEffect(() => {
    async function prepare() {
      try {
        const createdStore = await createStore()
        setStore(createdStore)
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }} onLayout={onLayoutRootView}>
        <NavigationContainer>
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
        </NavigationContainer>
        <StatusBar translucent style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
