import { create } from 'zustand'
import { shallow, } from 'zustand/shallow'
import { urbitConnectionStore } from '../features/urbitConnection/urbitConnectionStore'

const useUrbitStore = create(urbitConnectionStore)

export const useUrbitActions = () => useUrbitStore(state => state.actions)
export const useUrbitApi = () => useUrbitStore(state => ({
  isConnected: state.isConnected,
  api: state.api,
}), shallow)
export const useUrbitConnection = () => useUrbitStore(state => ({
  isConnected: state.isConnected,
  connection: state.connection,
}), shallow)
