import { createNativeStackNavigator } from '@react-navigation/native-stack'

import ViewActivityScreen from '../viewActivity/ViewActivityScreen'
import RecordActivityScreen from './RecordActivityScreen'


const Stack = createNativeStackNavigator()


export default function RecordActivityNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RecordActivityScreen"
        component={RecordActivityScreen}
        title="Record Activity"
        options={{ headerTitle: 'Record Activity' }}
      />
      <Stack.Screen
        name="RecordActivityViewActivity"
        component={ViewActivityScreen}
        title="View Recorded Activity"
        options={{ headerTitle: 'View Recorded Activity' }}
      />
    </Stack.Navigator>
  )
}
