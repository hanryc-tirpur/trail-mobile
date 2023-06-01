import Urbit from '@uqbar/react-native-api'


declare global {
  var api: Urbit;
  var window: Window & typeof globalThis;
  var ship: string;
}


export interface UrbitStore {
  isConnected: boolean;
  connection?: ShipConnection;
  api?: Urbit;
  actions: {
    connect: (connection: ShipConnection) => void,
    connectApi: (connection: ShipConnection) => void,
    setConnectionStatus: (isConnected: boolean) => void,
  }
}

export interface ShipConnection {
  ship: string;
  shipUrl: string;
  authCookie: string;
}
