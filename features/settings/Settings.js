import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useUrbitApi, useUrbitConnection } from '../../hooks/useUrbitStore'
import useAllActivities from '../../hooks/useAllActivities'
import useSyncUnsavedActivities from '../../data/useSyncUnsavedActivities'

export default function SettingsListScreen({ navigation }) {
  const { isConnected, } = useUrbitApi()


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      { isConnected
        ? (<ConnectedUrbit />)
        : (<ConnectToUrbit />)
      }
    </View>
  )
}

const ConnectToUrbit = () => {
  return (
    <Button
      title="Connect Your Urbit"
      onPress={() => navigation.navigate('SettingsNavigator', {
        screen: 'ConnectYourUrbit'
      })}
    />
  )
}

const ConnectedUrbit = () => {
  const [isActivityStateLoaded, activityState] = useAllActivities()
  const syncUnsavedActivities = useSyncUnsavedActivities()
  const { connection } = useUrbitConnection()

  return ( 
    <View>
      <View>
        <Text>Connected to {connection.ship}</Text>
      </View>
      { isActivityStateLoaded && activityState.unsavedActivities.length && (
        <View>
          <Text>
            You have unsaved activities. Do you want to save them to your Urbit?
          </Text>
          <TouchableOpacity
            onPress={syncUnsavedActivities}
          >
            <Text>Save Activities</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
