import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple'

import LoginScreen from '../../external/pongo/screens/Login'
import { useUrbitConnection } from '../../hooks/useUrbitStore'
import useNetworkState from '../../util/useNetworkState'
import useUrbitInstalledStatus, { InstalledStatus } from '../urbitConnection/useUrbitInstalledStatus'

import ConnectedUrbit from './ConnectedUrbit'
import ConnectUrbit from './ConnectUrbit'
import { DisconnectUrbitActivator } from './DisconnectUrbit'

export default function UrbitSettingsChooser() {
  const { isConnected } = useUrbitConnection()

  return isConnected
    ? (<UrbitSettings />)
    : (<ConnectUrbit />)
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
          <DisconnectUrbitActivator />
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


const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
})

