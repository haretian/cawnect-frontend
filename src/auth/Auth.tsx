import RegistrationForm from './registration/Registration'
import Login from './login/Login'

import './auth.css'
import Logo from '../assets/logo_light.svg'

function Auth() {
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
