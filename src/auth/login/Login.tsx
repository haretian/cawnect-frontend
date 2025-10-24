import { useDispatch } from 'react-redux';
import { setUserLogin } from '../../features/user/userSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const processLogin = () => {
        const acc = document.getElementById('login-acc') as HTMLInputElement;
        const pass = document.getElementById('login-pass') as HTMLInputElement;

        async function processUser() {
            let req = await fetch('https://jsonplaceholder.typicode.com/users?name=' + encodeURIComponent(acc.value))
            let response = await req.json()

            console.log(response)
            if (response.length == 0) {
                acc.setCustomValidity('Account does not exist.');
                acc.reportValidity();
                return
            }

            let user = response[0]
            if (user.address.street != pass.value) {
                pass.setCustomValidity('Password is incorrect.');
                pass.reportValidity();
                return
            }

            dispatch(setUserLogin({
                userid: user.id,
                accountName: user.name,
                displayName: user.name
            }))
            // Login complete, redirect to home
            navigate('/home')
        }

        processUser()
    }

    return (
        <form className="form" onSubmit={(e) => { e.preventDefault(); return processLogin() }}>
            <h2>login</h2>
            <div className='input-container'>
                <div className='input-field'>
                    <label>account name</label>
                    <input type="text" name="accName" id="login-acc" required={true} onChange={(event) => event.target.setCustomValidity('')} />
                </div>
                <div className='input-field'>
                    <label>password</label>
                    <input type="password" name="pass" id="login-pass" required={true} onChange={(event) => event.target.setCustomValidity('')} />
                </div>
            </div>
            <input className="button" type="submit" value="login" style={{ width: '30%' }} />
        </form>
    )
}

export default Login
