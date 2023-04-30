import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

import { loadAllActivities } from '../data/storage'

export default function useExportActivities() {
  const doExport = async () => {
    const allActivities = await loadAllActivities()
    const activityFile = `${FileSystem.documentDirectory}/trail-mobile.json`
    await FileSystem.writeAsStringAsync(activityFile, JSON.stringify(allActivities))
    
    const canShare = await Sharing.isAvailableAsync()
    if(canShare) {
      await Sharing.shareAsync(activityFile)
    }
  }

  return doExport
}
