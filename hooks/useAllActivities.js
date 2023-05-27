import { useEffect, useState } from 'react'

import { loadAllActivities } from '../data/storage'



export default function useAllActivities() {
  const [activityData, setActivityData] = useState(null)

  useEffect(() => {
    async function load() {
      const state = await loadAllActivities()
      setActivityData(state)
    }
    load()
  }, [])

  const allActivities = (activityData?.unsavedActivites || [])
    .concat((activityData?.savedActivites || []))
  return [allActivities.length !== 0, allActivities]
}
