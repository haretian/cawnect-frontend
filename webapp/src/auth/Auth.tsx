import RegistrationForm from './Registration'
import '../assets/styles.css'
import Logo from '../assets/logo_light.svg'
import './auth.css'
import Login from './Login'

function Auth() {
    return (
        <div className="background-login">
            <div className="main-login">
                <div className="header-login">
                    <h1 className='logo-text'>welcome</h1>
                    <div>
                        <img className="logo" src={Logo} />
                        <h1 className='logo-text'>caw!nect</h1>
                    </div>
                </div>
                <div className="login-container">
                    <RegistrationForm />
                    <div className='splitter'></div>
                    <Login />
                </div>
            </div>
        </div>
    )
}

export default Auth
