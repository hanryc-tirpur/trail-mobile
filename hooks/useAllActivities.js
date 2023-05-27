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

  const unsavedActivities = activityData?.unsavedActivites || []

  return [unsavedActivities.length !== 0, unsavedActivities]
}
