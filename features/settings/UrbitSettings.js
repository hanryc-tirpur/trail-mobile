import { StyleSheet, Text, View } from 'react-native'

import LoginScreen from '../../external/pongo/screens/Login'
import { useUrbitConnection } from '../../hooks/useUrbitStore'

export default function UrbitSettingsChooser() {
  const { isConnected } = useUrbitConnection()

  return isConnected
    ? (<UrbitSettings />)
    : (<LoginScreen />)
}


export function UrbitSettings() {
  return (
    <View style={styles.container}>
      <Text>
        Urbit Settings
      </Text>
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

