import RegistrationForm from './Registration'
import '../assets/styles.css'
import './auth.css'
import Login from './Login'

function Auth() {
    return (
        <div className="background-login">
            <div className="main-login">
                <h1>totlecard</h1>
                <div className="login-container">
                    <RegistrationForm />
                    <Login />
                </div>
            </div>
        </div>
    )
}

export default Auth
