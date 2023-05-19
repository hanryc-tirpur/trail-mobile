import { Button, StyleSheet, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { Cell, Section, TableView, } from 'react-native-tableview-simple'
import { useDispatch } from 'react-redux'

import { DistanceUnit, useDistanceUnit } from './hooks/useDistanceUnit'
import { changeDistanceUnits } from '../recordActivity/activitySlice'


const navigateToUnitSettings = navigation => navigation.navigate('Settings', {
  screen: 'UnitSettings'
})

export function UnitSettingsActivator({ navigation }) {
  const [distanceUnit] = useDistanceUnit()
  return (
    <Cell
      cellStyle="RightDetail"
      title="Units"
      detail={distanceUnit}
      accessory="DisclosureIndicator"
      onPress={() => navigateToUnitSettings(navigation)}
    />
  )
}

export default function UnitSettings() {
  const dispatch = useDispatch()
  const [distanceUnit, setDistanceUnit ] = useDistanceUnit()
  const getAccessory = unit => unit === distanceUnit ? 'Checkmark' : 'None'

  return (
    <ScrollView contentContainerStyle={styles.stage}>
      <TableView>
        <Section header="DISTANCE UNIT">
          <Cell
            cellStyle="Basic"
            title="Kilometers (km)"
            accessory={getAccessory(DistanceUnit.Km)}
            onPress={() => {
              setDistanceUnit(DistanceUnit.Km)
              dispatch(changeDistanceUnits({ unit: DistanceUnit.Km }))
            }}
          />
          <Cell
            cellStyle="Basic"
            title="Miles (mi)"
            accessory={getAccessory(DistanceUnit.Mile)}
            onPress={() => {
              setDistanceUnit(DistanceUnit.Mile)
              dispatch(changeDistanceUnits({ unit: DistanceUnit.Mile }))
            }}
          />
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
});
