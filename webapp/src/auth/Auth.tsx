import { useDispatch } from 'react-redux'
import RegistrationForm from './Registration'
import '../assets/styles.css'

function Auth() {
    const dispatch = useDispatch()

    return (
        <>
            <h1>hi</h1>
            <RegistrationForm />
        </>
    )
}

export default Auth
