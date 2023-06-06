import { useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"

import { useUrbitConnection } from '../../hooks/useUrbitStore'
import { scry } from '../../data/urbitApiSaga'

import { useAllActivities, } from '../allActivities/useActivitiesStore' 

import DashboardView from './DashboardView'
import { useNavigation } from '@react-navigation/native'
import { navigateToUrbitSettings } from '../settings/UrbitSettingsActivator'


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
  const navigation = useNavigation()
  

  return (
    <View style={{ flexGrow: 0, width: '100%', }}>
      <Text style={styles.primaryHeader}>Welcome to Trail</Text>
      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.secondaryHeader}>
          Why Trail?
        </Text>
        <Text style={styles.messageText}>
          Trail is a privacy-focused activity tracking application. It
          operates under the priciple that your data is yours and yours alone.
          To that end, your activity data only gets saved to your phone, and if
          you connect an Urbit, it will also be sent there.
        </Text>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.secondaryHeader}>
          Connect Your Urbit
        </Text>
        <Text style={styles.messageText}>
          If you connect your Urbit now, your activities will start being
          backed up immediately. You'll also be able to view your activities
          in your web browser
          with the accompanying web application. 
        </Text>
        <Text style={styles.messageText}>
          Don't know what Urbit is? No worries, the app works just fine without it.
          You can always explore Urbit later.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigateToUrbitSettings(navigation)}
            style={secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Connect Urbit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, styles.shadowProp]}>
        <Text style={styles.secondaryHeader}>
          Get Started!
        </Text>
        <Text style={styles.messageText}>
          Feeling the need to move after all these words?
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Record')}
            style={secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Record Your First Activity</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}



const buttonStyle = {
  borderColor: '#158445',
  borderRadius: 20,
  borderWidth: 2,
  marginLeft: 10,
  marginRight: 10,
  padding: 10,
}
const buttonTextStyle = {
  fontSize: 18,
  fontWeight: 'bold',
  textAlign: 'center',
  width: '100%',
}
const secondaryButton = {
  ... buttonStyle,
  backgroundColor: "#158445",
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },

  primaryHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#158445', 
    textAlign: 'center',
  },

  secondaryHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', //'#158445', 
  },

  messageText: {
    fontSize: 18,
    marginTop: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderColor: 'black',
    borderRadius: 8,
    marginTop: 20,
    padding: 10,
  },

  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  secondaryButtonText: {
    ... buttonTextStyle,
    color: '#fff',
  },
  buttonContainer: {
    marginTop: 10,
  },
  
})
