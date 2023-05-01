import { useCallback, useEffect, useState } from 'react'

import * as SplashScreen from 'expo-splash-screen'

import createStore from '../store'


SplashScreen.preventAutoHideAsync()


export default function useSplashScreen() {
  const [ appIsReady, setAppIsReady ] = useState(false)
  const [ store, setStore ] = useState(null) 

  useEffect(() => {
    async function prepare() {
      try {
        const createdStore = await createStore()
        setStore(createdStore)

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
