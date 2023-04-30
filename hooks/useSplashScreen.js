import { useCallback, useEffect, useState } from 'react'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as SplashScreen from 'expo-splash-screen'

import createStore from '../store'
import { loadAllActivities } from '../data/storage'


SplashScreen.preventAutoHideAsync()


export default function useSplashScreen() {
  const [ appIsReady, setAppIsReady ] = useState(false)
  const [ store, setStore ] = useState(null) 

  useEffect(() => {
    async function prepare() {
      try {
        const createdStore = await createStore()
        setStore(createdStore)
        const allActivities = await loadAllActivities()
        const activityFile = `${FileSystem.documentDirectory}/allActivities.json`
        await FileSystem.writeAsStringAsync(activityFile, JSON.stringify(allActivities))
        
        const canShare = await Sharing.isAvailableAsync()
        console.log(`I can share: ${canShare}`)
        if(canShare) {
          await Sharing.shareAsync(activityFile)
        }
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady])

  return { appIsReady, onLayoutRootView, store }
}
