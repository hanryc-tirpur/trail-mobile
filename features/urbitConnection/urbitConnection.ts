import { ShipConnection, } from "./urbitTypes"
import { subscribe } from './urbitBus'
import { urbitConnectionStore } from './urbitConnectionStore'

const { actions: { setConnectionStatus } } = urbitConnectionStore.getState()

subscribe(verifyConnection)

export async function verifyConnection(connection: ShipConnection) {
  const nameUrl = `${connection.shipUrl}/~/name`
  try {
    const nameResponse = await fetch(nameUrl, {
      headers: {
        Cookie: connection.authCookie,
      },
      credentials: 'include',
    })
    if(nameResponse.status === 200 || nameResponse.status === 403) {
      setConnectionStatus(true)
    }
  } catch (ex) {
    setConnectionStatus(false)
  }
}
