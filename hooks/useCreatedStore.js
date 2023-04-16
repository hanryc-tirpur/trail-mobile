import { useEffect } from 'react'

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

