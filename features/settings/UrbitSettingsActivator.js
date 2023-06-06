import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple'

import { useUrbitConnection } from '../../hooks/useUrbitStore'

import ConnectedUrbit from './ConnectedUrbit'


export const navigateToUrbitSettings = navigation => navigation.navigate('Settings', {
  screen: 'ConnectYourUrbit'
})

export default function UrbitSettingsActivator({ navigation }) {
  const { connection, isConnected, } = useUrbitConnection()

  return isConnected
    ? (
      <Cell
        cellStyle="Basic"
        onPress={() => navigateToUrbitSettings(navigation)}
        cellContentView={<ConnectedUrbit {... connection} />}
      />
    )
    : (
      <Cell
        cellStyle="Basic"
        title="Connect your Urbit"
        accessory="DisclosureIndicator"
        onPress={() => navigateToUrbitSettings(navigation)}
      />
    )
}
