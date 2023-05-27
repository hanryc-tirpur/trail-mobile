import { useEffect, useState } from 'react'

import { useViewActivity } from './useVewActivityStore'


export default function useRedirectOnNoActivity(navigation: any) {
  const { hasActivity } = useViewActivity()

  useEffect(() => {
    if(!hasActivity) {
      navigation.navigate('RecordActivityScreen')
    }
  })
}
