import { useState } from 'react'
import NetInfo from '@react-native-community/netinfo'


export default function useNetInfo() {
  const [netInfo, setNetInfo] = useState()

  NetInfo.fetch().then(state => setNetInfo(state))

  return [netInfo]
}
