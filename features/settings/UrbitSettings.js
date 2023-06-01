import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'

import LoginScreen from '../../external/pongo/screens/Login'
import { useUrbitConnection } from '../../hooks/useUrbitStore'
import useNetworkState from '../../util/useNetworkState'
import useUrbitInstalledStatus, { InstalledStatus } from '../urbitConnection/useUrbitInstalledStatus'
import { Cell, Section, TableView } from 'react-native-tableview-simple'

export default function UrbitSettingsChooser() {
  const { isConnected } = useUrbitConnection()

  return isConnected
    ? (<UrbitSettings />)
    : (<LoginScreen />)
}


export function UrbitSettings() {
  const isNetworkAvailable = useNetworkState()
  const [installedStatus, installTrail] = useUrbitInstalledStatus()
  const { connection, isConnected, } = useUrbitConnection()

  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
        <Section header="CONNECTED TO">
          <Cell
            cellStyle="Basic"
            cellContentView={<ConnectedUrbit {... connection} />}
          />
        </Section>
          <Section header="APP INSTALLATION">
          {installedStatus === InstalledStatus.Unknown &&
            <Cell
              cellStyle="Basic"
              title="Verifying %trail installation"
              cellAccessoryView={<ActivityIndicator />}
            />
          }
          {installedStatus === InstalledStatus.NotInstalled &&
            <Cell
              cellStyle="Basic"
              title="NOT INSTALLED - Install %trail"
              onPress={() => installTrail()}
            />
          }
          {installedStatus === InstalledStatus.Installing &&
            <Cell
              cellStyle="Basic"
              title="Installing %trail"
              cellAccessoryView={<ActivityIndicator />}
            />
          }
          {installedStatus === InstalledStatus.Installed &&
            <Cell
              cellStyle="Basic"
              title="INSTALLED"
              accessory="Checkmark"
            />
          }
          </Section>
      </TableView>
    </ScrollView>
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




const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
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
})

