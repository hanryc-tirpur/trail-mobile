import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider } from "react-native-safe-area-context"

import useColors from '../external/pongo/hooks/useColors'
import useColorScheme from '../external/pongo/hooks/useColorScheme'
import useStore from '../external/pongo/state/useStore'

import LoginScreen from '../external/pongo/screens/Login'
import RecordActivity from '../features/recordActivity/RecordActivity'

export default function HomeScreen() {
  const { loading, setLoading, ship: self, shipUrl, authCookie, loadStore, needLogin, setNeedLogin, setShip, addShip } = useStore()
  const { color, backgroundColor } = useColors()
  const colorScheme = useColorScheme()

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {(needLogin && (!shipUrl || !self || !authCookie))
        ? (
          <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
            <StatusBar translucent style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <LoginScreen />
          </SafeAreaProvider>
        ) : (<>
          <SafeAreaProvider style={{ backgroundColor, height: '100%', width: '100%' }}>
            <StatusBar translucent style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RecordActivity /> 
          </SafeAreaProvider>
        </>)
      }
    </View>
  )
}
