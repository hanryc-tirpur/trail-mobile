import { ShipConnection, } from './urbitTypes'

type Handler = ((connection: ShipConnection) => void)
  | ((connection: ShipConnection) => Promise<void>)

const subs: Handler[]  = []

export function subscribe(sub: Handler) {
  subs.push(sub)
}

export function publish(connection: ShipConnection) {
  subs.forEach(sub => sub(connection))
}
