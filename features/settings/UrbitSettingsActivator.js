import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple'

import { useUrbitConnection } from '../../hooks/useUrbitStore'


const navigateToUrbitSettings = navigation => navigation.navigate('SettingsNavigator', {
  screen: 'ConnectYourUrbit'
})

export default function UrbitSettingsActivator({ navigation }) {
  const { connection, isConnected, } = useUrbitConnection()

  return isConnected
    ? (
      <Cell
        cellStyle="Basic"
        accessory="DisclosureIndicator"
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

const ConnectedUrbit = ({ ship }) => {
  const initial = ship.replace('~', '')[0]
  return (
    <View style={styles.profile}>
      <View style={styles.profileImageContainer}>
        <Text style={styles.profileImageText}>{initial}</Text>
      </View>
      <View style={styles.profileContentContainer}>
        <Text style={styles.ship}>{ship}</Text>
        <Text>Connection & Sync</Text>
      </View>
    </View>
  )
}

const styles = {
  profileContentContainer: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: 15,
  },
  profileImageContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    borderRadius: 60 / 2,
    backgroundColor: 'orange',
  },
  profileImageText: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 10,
  },
  ship: {
    fontSize: 22,
    fontWeight: 'bold',
  }
}
