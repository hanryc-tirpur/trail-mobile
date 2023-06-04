import { StateCreator, create } from 'zustand'


interface ConnectionProcessStore {
  acceptedUrl: string | null,
  hasAcceptedUrl: boolean,
  actions: {
    acceptUrl: (url: string) => void,
  }
}

const connectionProcessStore: StateCreator<ConnectionProcessStore> = (set, get) => ({
  acceptedUrl: null,
  hasAcceptedUrl: false,
  actions: {
    acceptUrl(url) {
      set({
        acceptedUrl: url,
        hasAcceptedUrl: true,
      })
    }
  }
})

const useConnectionProcessStore = create(connectionProcessStore)

export const useConnectionProcessActions = () => useConnectionProcessStore(state => state.actions)
export const useConnectionProcessUrl = () => useConnectionProcessStore(state => ({
  acceptedUrl: state.acceptedUrl,
  hasAcceptedUrl: state.hasAcceptedUrl,
}))
