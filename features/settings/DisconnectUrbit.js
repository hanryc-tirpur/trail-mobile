import { Button, StyleSheet, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView, } from 'react-native-tableview-simple'
import { useDispatch } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import { useDistanceUnit } from './hooks/useDistanceUnit'
import { changeDistanceUnits } from '../recordActivity/activitySlice'
import { DistanceUnit, setDistanceUnit } from '../../util/distanceCalculator'
import { useState } from 'react'
import { useUrbitActions } from '../../hooks/useUrbitStore'


const navigateToDisconnectUrbit = navigation => navigation.navigate('Settings', {
  screen: 'DisconnectUrbit'
})

export function DisconnectUrbitActivator() {
  const navigation = useNavigation()
  return (
    <Cell
      cellStyle="Basic"
      title="Disconnect your Urbit"
      accessory="DisclosureIndicator"
      onPress={() => navigateToDisconnectUrbit(navigation)}
    />
  )
}

export default function DisconnectUrbit() {
  const { disconnect: disconnectUrbit } = useUrbitActions()
  const navigation = useNavigation()
  const [doesUserUnderstand, setUserUnderstands] = useState(false)
  const toggleSwitch = () => setUserUnderstands(previousState => !previousState)
  const disconnect = () => {
    disconnectUrbit()
    navigation.popToTop()
  }

  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
        <Section header="DISCONNECTING YOUR URBIT">
          <Cell
            cellStyle="Basic"
            cellContentView={<View style={styles.warningTextContainer}>
              <Text style={styles.warningText}>
                By disconnecting your Urbit, your activities will no longer be synced to
                your Urbit from
                your device. Your device will also no longer receive activities imported 
                from other sources.
              </Text>

              <Text style={styles.warningText}>
                Disconnecting your Urbit will NOT result in data loss. Activities that have
                already been synced to your Urbit will not be affected, and
                any activities that have not yet been synced will remain on your device.
              </Text>
            </View>}
          />
          <Cell
            cellStyle="Basic"
            title="I understand"
            cellAccessoryView={<Switch
              trackColor={{ true: '#D32F2F' }}
              onValueChange={toggleSwitch}
              value={doesUserUnderstand}
            />}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
        </Section>
      </TableView>

      <View style={{}}>
        <TouchableOpacity
          onPress={disconnect}
          style={doesUserUnderstand ? styles.maydayButton : styles.maydayButtonDisabled}
          disabled={!doesUserUnderstand}
        >
          <Text style={styles.maydayButtonText}>Disconnect</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
const maydayButton = {
  ... buttonStyle,
  backgroundColor: '#D32F2F',
  borderColor: '#D32F2F',
}
const actionButton = {
  ... buttonStyle,
}
const secondaryButton = {
  ... buttonStyle,
  backgroundColor: "#158445",
}
const buttonTextStyle = {
  fontSize: 32,
  fontWeight: 'bold',
  textAlign: 'center',
  width: '100%',
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4', // Change to #000 to preview Dark Mode/Appereance
    paddingTop: 20,
    paddingBottom: 20,
  },
  screen: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  controlsContainer: {
    marginBottom: 10,
    width: '100%',
  },
  progressContainer: {
    flex: 2,
    width: '100%',
  },
  totalsContainer: {
    flexDirection: 'row',
    fontVariant: ['tabular-nums'],
    marginBottom: 25,
    marginLeft: 25,
    marginRight: 25,
    width: '100%',
  },
  segmentContainer: {
    flex: 1,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    width: '100%',
  },
  segmentNumbersContainer: {
    flex: 1,
    fontVariant: ['tabular-nums'],
    marginTop: 25,
    width: '100%',
  },
  segmentNumbers: {
    fontSize: 48,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
  fixedNumbers: {
    fontSize: 28,
    fontVariant: ['tabular-nums'],
    fontWeight: 'bold',
  },
  actionButton: {
    ... actionButton,
    flex: 4,
    marginRight: 0,
  },
  secondaryButton: {
    ... secondaryButton,
    flex: 6,
  },
  secondaryButtonText: {
    ... buttonTextStyle,
    color: '#fff',
  },
  buttonText: {
    ... buttonTextStyle,
    color: '#158445',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  totalsLabel: {
    fontSize: 24,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },

  sectionHeader: {
    fontSize: 32,
  },
  multiButton: {
    flexDirection: 'row',
  },
  maydayButton: {
    ... maydayButton,
  },
  maydayButtonDisabled: {
    ... maydayButton,
    backgroundColor: '#cecece',
    borderColor: '#cecece',
  },
  maydayButtonText: {
    ... buttonTextStyle,
    color: '#fff',
  },
  warningText: {
    fontSize: 18,
    paddingBottom: 10,
  },
  warningTextContainer: {
    padding: 10,
  }
})
