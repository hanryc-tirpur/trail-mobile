import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentLocation: null,
}

export const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    updateLocation: (state, { payload }) => {
      const { location } = payload

      state.currentLocation = location
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateLocation } = locationSlice.actions

export default locationSlice.reducer
