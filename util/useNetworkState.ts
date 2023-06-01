import { getNetworkStateAsync } from 'expo-network'
import { useState } from 'react'
import { useInterval } from './useInterval'

export default function useNetworkState() {
  const [isNetworkAvailable, setIsNetworkAvailable] = useState(false)

  useInterval(async () => {
    const {
      isConnected,
      isInternetReachable,
    } = await getNetworkStateAsync()
    setIsNetworkAvailable(Boolean(isInternetReachable && isConnected))
  }, 5000)

  return isNetworkAvailable
}
