import Urbit from '@uqbar/react-native-api'
import { CompletedActivity } from '../allActivities/activityTypes';


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
    disconnect: () => void,
    setConnectionStatus: (isConnected: boolean) => void,
    syncActivity: (activity: CompletedActivity) => Promise<void>,
  }
}

export interface ShipConnection {
  ship: string;
  shipUrl: string;
  authCookie: string;
}
