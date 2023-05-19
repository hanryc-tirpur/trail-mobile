import AsyncStorage from '@react-native-async-storage/async-storage'
import Urbit from '@uqbar/react-native-api'
import { configureApi } from '@uqbar/react-native-api/configureApi'
import { StateCreator, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { shallow, } from 'zustand/shallow'

const SETTINGS_STORE_KEY = 'trail/urbit'

interface SettingsStore {
  distanceUnit: DistanceUnit,
  actions: {
    updateDistanceUnit: (unit: DistanceUnit) => void;
  }
}

export enum DistanceUnit {
  Mile = 'mi',
  Km = 'km',
}


const settingsStore: StateCreator<SettingsStore> = (set, get) => ({
  distanceUnit: DistanceUnit.Km,
  actions: {
    updateDistanceUnit: unit => set({ distanceUnit: unit }),
  }
})

const useSettingsStore = create(persist(settingsStore, {
  name: SETTINGS_STORE_KEY,
  version: 1,
  storage: createJSONStorage(() => AsyncStorage),
  partialize: state => {
    const { actions, ...rest } = state
    return { ...rest }
  },
}))

export const useSettingsActions = () => useSettingsStore(state => state.actions)
export const useDistanceUnit = () => useSettingsStore(state => [
  state.distanceUnit,
  state.actions.updateDistanceUnit,
])
