import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        accountName: '',
        displayName: '',
        userEmail:'',
        phone:'',
        zip:'',
        password:''
    },
    reducers: {
        pickName: (state: any, action) => {
            state.users = action.payload.user
        }
    }
})

export const { pickName } = userSlice.actions

export default userSlice.reducer