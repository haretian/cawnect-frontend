import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accountName: 'user',
        userid: 0,
        displayName: 'user',
        userEmail:'',
        phone:'',
        zip:'',
        password:''
    },
    reducers: {
        setUser: (state: any, action) => {
            state.accountName = action.payload.accountName
            state.userid = action.payload.userid
            state.displayName = action.payload.displayName
        }
    }
})

export const { setUser } = userSlice.actions

export default userSlice.reducer