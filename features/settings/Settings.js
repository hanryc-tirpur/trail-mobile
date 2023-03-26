import { Button, StyleSheet, Text, View } from 'react-native'

export default function SettingsListScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Connect Your Urbit"
        onPress={() => navigation.navigate('SettingsNavigator', {
          screen: 'ConnectYourUrbit'
        })
        }
      />
    </View>
  )
}
