import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        // User state
        userid: 0,
        username: '',    // Empty when user is logged out
        displayName: '',
        userEmail: 'dummy@email.com',
        phone: '',
        zip: '',
        passwordLen: 0,
        avatar: '',

        // Extra user info
        status: "caw!",

        // Information
        loginError: ''
    },
    reducers: {

        //
        // AUTHENTICATION
        //

        loginUser: (state: any, action) => {
            state.username = action.payload.username;
        },

        setLoginError: (state: any, action) => {
            state.loginError = action.payload.msg;
        },

        resetLoginError: (state: any) => {
            state.loginError = ""
        },

        loginNewUser: (state: any, action) => {
            state.userid = action.payload.userid
            state.username = action.payload.username
            if (!action.payload.displayName)
                state.displayName = action.payload.username
            else
                state.displayName = action.payload.displayName
            state.userEmail = action.payload.userEmail
            state.phone = action.payload.phone
            state.zip = action.payload.zip
            state.password = action.payload.password

            // Cookies are not set since new registration is not persistient
        },

        logoutUser: (state: any) => {
            state.username = ""
            state.status = "caw!"
        },

        //
        // PROFILE
        //

        updateStatus: (state: any, action) => {
            state.status = action.payload.status
        },

        updateDisplay: (state: any, action) => {
            state.displayName = action.payload.display;
        },

        updateUserProfile: (state: any, action) => {
            if (action.payload.display !== "")
                state.displayName = action.payload.display
            if (action.payload.email !== "")
                state.userEmail = action.payload.email
            if (action.payload.phone !== "")
                state.phone = action.payload.phone
            if (action.payload.zipcode !== "")
                state.zip = action.payload.zipcode
            if (action.payload.password !== "")
                state.passwordLen = action.payload.passwordLen
        },

        updateAvatar: (state: any, action) => {
            state.avatar = action.payload.avatar;
        },
    }
})

export const {
    loginUser,
    loginNewUser,
    logoutUser,

    setLoginError,
    resetLoginError,

    updateStatus,
    updateDisplay,
    updateUserProfile,
    updateAvatar,
} = userSlice.actions

export default userSlice.reducer