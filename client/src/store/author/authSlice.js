import {createSlice} from '@reduxjs/toolkit'

const initialState = {
   user: null,
   token: null,
}
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login:(state, action) => {
            state.user = action.payload.others
            state.token = action.payload.token
        },
        register:(state, action) => {
            state.user = action.payload.others
            state.token = action.payload.token
        },
        logout: (state) => {
            state.user = null
            state.token = null
            localStorage.clear()
        }
    }
})

export const authAction = authSlice.actions

export default authSlice.reducer;

// the store is composed of several slices, each owning one piece of state (this one owns auth)