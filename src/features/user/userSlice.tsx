import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accountName: 'user',
        userid: 0,
        displayName: 'user',
        userEmail: 'dummy@email.com',
        phone: '123-456-7890',
        zip: '12345',
        password: '12345'
    },
    reducers: {
        setUserLogin: (state: any, action) => {
            state.accountName = action.payload.accountName
            state.userid = action.payload.userid
            state.displayName = action.payload.displayName
        },

        setUserProfile: (state: any, action) => {
            if (action.payload.displayName != "")
                state.displayName = action.payload.displayName
            if (action.payload.email != "")
                state.userEmail = action.payload.email
            if (action.payload.phone != "")
                state.phone = action.payload.phone
            if (action.payload.zip != "")
                state.zip = action.payload.zip
            if (action.payload.password != "")
                state.password = action.payload.password
        }
    }
})

export const { setUserLogin, setUserProfile } = userSlice.actions

export default userSlice.reducer