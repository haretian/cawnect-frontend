import type { UserState } from '../main'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../features/user/userSlice'
import RegistrationForm from './registration/Registration'
import Login from './login/Login'
import { url } from '../main'

import './auth.css'
import Logo from '../assets/logo_light.svg'

function Auth() {
    const username = useSelector((state: UserState) => state.user.username)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Log in user if cookie is set
    useEffect(() => {
        async function processUser() {
            // Try and get headline
            let response = await fetch(url('/headline'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            // Can't make request means not logged in, do nothing
            if (!response.ok) {
                return
            }

            let res = await response.json();
            dispatch(loginUser({ username: res.username }));
            return
        }

        processUser();
    }, [])

    // Redirect when logged in
    useEffect(() => {
        // Logged in, redirect to home
        if (username !== "") {
            navigate('/')
        }
    }, [username])

    return (
        <div className="background-login">
            <div className="main-login">
                <div className="header-login">
                    <h1 className='logo-text'>welcome</h1>
                    <div></div>
                    <div>
                        <img className="logo" src={Logo} />
                        <h1 className='logo-text'>caw!nect</h1>
                    </div>
                </div>
                <div className="login-container">
                    <RegistrationForm />
                    <div className='login-splitter'></div>
                    <Login />
                </div>
            </div>
        </div>
    )
}

export default Auth
