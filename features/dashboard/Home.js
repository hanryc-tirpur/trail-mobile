import { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"

import { useUrbitConnection } from '../../hooks/useUrbitStore'
import { scry } from '../../data/urbitApiSaga'

import { useAllActivities, } from '../allActivities/useActivitiesStore' 

import DashboardView from './DashboardView'


export default function HomeScreen() {
  const { isConnected } = useUrbitConnection()
  const backgroundColor = '#fff'
  const activities = useAllActivities()

  const hasActivities = (activities || []).length !== 0

  useEffect(() => {
    async function getIt() {
      try {
        const acts = await scry({
          app: 'trail',
          path: '/activities/all',
        })
        console.log('from server', acts)
      } catch (ex) {
        console.log(`Could not fetch latest activities, got status ${ex.status}`)
      }
    }
    if(isConnected) {
      getIt()
    }
  }, [isConnected])

  return (
    <View style={styles.container}>
      <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
        { hasActivities
          ? (<DashboardView />) 
          : (<NoActivities />)
        }
      </SafeAreaProvider>
    </View>
  )
}

const NoActivities = () => {
  return (
    <View style={{ flexGrow: 0, width: '100%', }}>
      <Text>Record an activity!</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
})
