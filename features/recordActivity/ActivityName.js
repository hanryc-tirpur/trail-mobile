import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import useActivityName from './useActivityName'
import { TextInput } from '../../external/pongo/components/Themed'


export default function ActivityName() {
  const {
    acceptActivityName,
    activityName,
    isEditing,
    nameInputRef,
    rejectActivityName,
    startEditing,
    setTempActivityName,
    tempActivityName,
  } = useActivityName()

  return (
    <View style={styles.activityNameContainer}>
      { !isEditing
      ? (<>
        <Text style={styles.activityNameLabel}>{activityName}</Text>
        <TouchableOpacity style={styles.editNameIcon} onPress={() => startEditing()}>
          <FontAwesome5 name="edit" size={24} color="#158445" />
        </TouchableOpacity>
      </>)
      : (<>
        <TextInput
          ref={nameInputRef}
          style={styles.input}
          onChangeText={setTempActivityName}
          value={tempActivityName}
          autoCorrect={false}
          autoFocus
        /> 
        <TouchableOpacity style={styles.editNameIcon} onPress={() => rejectActivityName()}>
          <FontAwesome5 name="times-circle" size={24} color="#158445" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editNameIcon} onPress={() => acceptActivityName()}>
          <FontAwesome5 name="check" size={24} color="#158445" />
        </TouchableOpacity>
      </>)
      }
    </View>
  )
}

const styles = StyleSheet.create({
  activityNameContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 5,
    width: '100%',
    height: 50,
  },
  activityNameLabel: {
    color: '#158445',
    fontSize: 32,
    fontWeight: 'bold',
    flex: 1,
  },
  editNameIcon: {
    marginTop: 8,
    verticalAlign: 'bottom',
  },
  input: {
    color: '#158445',
    fontSize: 32,
    flex: 1,
  },
})
