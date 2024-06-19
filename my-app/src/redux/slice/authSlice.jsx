import { createSlice } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

export const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, 
                    payload: null, 
                    aboutMe: null},
    reducers: {
        logIn(state, {payload:token}){
            const payload = jwtDecode(token)
            if ({payload:token}){
                state.payload = payload
                state.token = token
            }
        },
        logout(state){
            state.payload = null
            state.token = null
        },
        setAboutMe (state, {payload: aboutMe}) {
            state.aboutMe = aboutMe
        },
      
    }
})

export const { logIn, logout, } = authSlice.actions
export default authSlice.reducer