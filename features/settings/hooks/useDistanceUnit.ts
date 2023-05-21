import AsyncStorage from '@react-native-async-storage/async-storage'
import { StateCreator, create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { shallow, } from 'zustand/shallow'

import { DistanceUnit, setDistanceUnit } from '../../../util/distanceCalculator'

const SETTINGS_STORE_KEY = 'trail/settings'

interface SettingsStore {
  distanceUnit: DistanceUnit,
  actions: {
    updateDistanceUnit: (unit: DistanceUnit) => void;
  }
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
  onRehydrateStorage: state => {
    return (state, error) => {
      if(!state) {
        return
      }

      setDistanceUnit(state.distanceUnit)
      console.log('rehydrated settings', state)
    }
  }
}))

export const useSettingsActions = () => useSettingsStore(state => state.actions)
export const useDistanceUnit = () => useSettingsStore(state => [
  state.distanceUnit,
  state.actions.updateDistanceUnit,
])
