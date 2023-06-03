import { useEffect, useState } from "react"
import useNetworkState from "../../util/useNetworkState"
import { useUrbitApi } from '../../hooks/useUrbitStore'
import { useInterval } from "../../util/useInterval"

export enum InstalledStatus {
  Unknown = 'UNKNOWN',
  Installed = 'INSTALLED',
  Installing = 'INSTALLING',
  NotInstalled = 'NOT_INSTALLED',
}

export default function useUrbitInstalledStatus() {
  const isNetworkAvailable = useNetworkState()
  const { api: urbitApi } = useUrbitApi()
  const [installedStatus, setInstalledStatus] = useState(InstalledStatus.Unknown)

  useEffect(() => {
    if(!isNetworkAvailable || !urbitApi) {
      return setInstalledStatus(InstalledStatus.Unknown)
    }

    async function verifyInstallation() {
      try {
        if(!urbitApi) return

        await urbitApi.scry({ app: 'trail', path: '/activities/all'})
        setInstalledStatus(InstalledStatus.Installed)
      } catch (ex: any) {
        console.log(`Could not connect to trail on your Urbit, got status ${ex.status}`)
        setInstalledStatus(InstalledStatus.NotInstalled)
      }
    }
    verifyInstallation()
  }, [urbitApi, isNetworkAvailable])

  useInterval(async () => {
    try {
      if(!urbitApi) return

      await urbitApi.scry({ app: 'trail', path: '/activities/all'})
      setInstalledStatus(InstalledStatus.Installed)
    } catch (ex: any) {
      console.log(`Could not connect to trail on your Urbit, got status ${ex.status}`)
    }
  }, installedStatus === InstalledStatus.Installing ? 5000 : null)

  async function installTrail() {
    if(installedStatus === InstalledStatus.Installing) return

    setInstalledStatus(InstalledStatus.Installing)
    try {
      await urbitApi!.poke({
        app: 'hood',
        mark: 'kiln-install',
        json: {
          local: 'trail',
          desk: 'trail',
          ship: '~modlyx-hidled-hanryc-tirpur',
        },
      }) 
    } catch (ex) {
      console.log('Error installing trail', ex)
    }
  }

  return [installedStatus, installTrail]
}

//   useEffect(() => {
//     const initInstall = async () => {

    

//     if (api && Boolean(networkState.isInternetReachable)) {
//       Promise.all([
//         api.scry({ app: 'pongo', path: '/conversations' }),
//         api.scry({ app: 'social-graph', path: '/is-installed' }),
//       ])
//       .catch(async () => {
//         // Only go here if one of the above apps is not installed
//         try {
//           await api.scry({ app: 'social-graph', path: '/is-installed' })
//         } catch {
//           setLoadingText('Installing urbit apps...')
//           try {
//             await api.poke({ app: 'hood', mark: 'kiln-install', json: { local: NECTAR_APP, desk: NECTAR_APP, ship: NECTAR_HOST } })
//             setTimeout(() => initPosse(api), 20 * ONE_SECOND)
//           } catch {}
//         }

//         await new Promise((resolve) => {
//           const interval = setInterval(async () => {
//             try {
//               await api.scry({ app: 'pongo', path: '/conversations' })
//             } catch {
//               setLoadingText('Installing urbit apps...')
//               try {
//                 await api.scry({ app: 'social-graph', path: '/is-installed' })
//                 await api.poke({ app: 'hood', mark: 'kiln-install', json: { local: PING_APP, desk: PING_APP, ship: PING_HOST } })
//                 setTimeout(() => initPongo(api), 20 * ONE_SECOND)
//                 clearInterval(interval)
//                 resolve(true)
//               } catch {}
//             }
//           }, 5 * ONE_SECOND)
//         })
// })

// }
