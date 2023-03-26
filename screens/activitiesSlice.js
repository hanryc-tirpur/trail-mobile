import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  activities: [],
}

export const activitiesSlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    addActivity: (state, { payload }) => {
      const { activity } = payload

      state.activities = [
        ... state.activities,
        activity,
      ]
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  addActivity,
} = activitiesSlice.actions

export default activitiesSlice.reducer
