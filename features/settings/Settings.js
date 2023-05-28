import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple'

import { useUrbitApi, useUrbitConnection } from '../../hooks/useUrbitStore'
import useExportActivities from '../../hooks/useExportActivityData'
import { UnitSettingsActivator } from './UnitSettings'
import UrbitSettingsActivator from './UrbitSettingsActivator'
import { useUnsyncedActivities } from '../allActivities/useActivitiesStore'

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default function SettingsListScreen({ navigation }) {
  const exportActivities = useExportActivities()
  
  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
        <UrbitSettingsActivator navigation={navigation} />

        <Section header="APP">
          <UnitSettingsActivator navigation={navigation} />
        </Section>

        <Section header="DATA">
          <View>
            <Text>
              Export your activities
            </Text>
            <TouchableOpacity
              onPress={exportActivities}
            >
              <Text>Export</Text>
            </TouchableOpacity>
          </View>
        </Section>
      </TableView>
    </ScrollView>
  )
}

const ConnectToUrbit = ({ navigation }) => {
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
  const unsyncedActivities = useUnsyncedActivities()
  const exportActivities = useExportActivities()
  const { connection } = useUrbitConnection()

  return ( 
    <View>
      <View>
        <Text>Connected to {connection.ship}</Text>
      </View>
      { unsyncedActivities?.length && (
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
      { isActivityStateLoaded && (
        <View>
          <Text>
            Export your activities
          </Text>
          <TouchableOpacity
            onPress={exportActivities}
          >
            <Text>Export</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}
