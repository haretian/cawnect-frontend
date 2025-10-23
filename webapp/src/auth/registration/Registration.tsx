import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
    const navigate = useNavigate()

    const setTimestamp = () => {
        const ts = document.getElementById('ts') as HTMLInputElement;
        ts.value = String(Date.now());
    }

    var lastVal = 0;
    function formatPhone() {
        const phone = document.getElementById('phone') as HTMLInputElement;
        // Insert formatting
        if (phone.value.length > 3 && phone.value.charAt(3) != '-')
            phone.value = phone.value.slice(0, 3) + '-' + phone.value.slice(3);
        if (phone.value.length > 7 && phone.value.charAt(7) != '-')
            phone.value = phone.value.slice(0, 7) + '-' + phone.value.slice(7);
        // Correct backspace behavior
        if ((phone.value.length == 3 && lastVal == 4) || (phone.value.length == 7 && lastVal == 8))
            phone.value = phone.value.slice(0, -1);
        lastVal = phone.value.length;
    }

    // Form validation routine
    const validateForm = () => {
        const acc = document.getElementById('acc') as HTMLInputElement;
        if (acc.value.slice(0, 1).match(/[0-9]/)) {
            acc.setCustomValidity('Account name cannot start with a number.');
            acc.reportValidity();
            return false;
        }
        let illegalChars = acc.value.match(/[^a-zA-Z0-9]/g);
        if (illegalChars) {
            acc.setCustomValidity('Account name contains illegal characters: \'' + illegalChars + '\'.');
            acc.reportValidity();
            return false;
        }

        const dob = document.getElementById('dob') as HTMLInputElement;
        let dobVal = new Date(dob.valueAsNumber);
        let timeDiff = new Date(Date.now() - dobVal.valueOf());
        if ((timeDiff.getUTCFullYear() - 1970) < 18) {
            dob.setCustomValidity('Age must be over 18.');
            dob.reportValidity();
            return false;
        }

        const pass = document.getElementById('pass') as HTMLInputElement;
        const confirmPass = document.getElementById('cpass') as HTMLInputElement;
        if (pass.value != confirmPass.value) {
            confirmPass.setCustomValidity('Does not match password.');
            confirmPass.reportValidity();
            return false;
        }

        return true;
    }

    const linkPassword = () => {
        const pass = document.getElementById('pass') as HTMLInputElement;
        const confirmPass = document.getElementById('cpass') as HTMLInputElement;
        confirmPass.setCustomValidity('');
        pass.setCustomValidity('');
    }

    const processForm = () => {
        if (!validateForm())
            return;

        // Login complete, redirect to home
        navigate('/home')
    }

    return (
        <form className="form" onSubmit={(e) => { e.preventDefault(); return processForm() }}>
            <h2>registration</h2>
            <div className="input-container">
                <div className="input-columns">
                    <div>
                        <div className='input-field'>
                            <label>account name*</label>
                            <input type="text" name="accName" id="acc" required={true} onChange={(event) => event.target.setCustomValidity('')} />
                        </div>
                        <div className='input-field'>
                            <label>display name</label>
                            <input type="text" name="displayName" />
                        </div>
                        <div className='input-field'>
                            <label>email address*</label>
                            <input type="email" name="email" required={true} />
                        </div>
                        <div className='input-field'>
                            <label>phone*</label>
                            <input type="tel" name="phone" id="phone" required={true} placeholder="000-000-0000" maxLength={12} pattern="\d\d\d-\d\d\d-\d\d\d\d" onInput={formatPhone} />
                        </div>
                    </div>
                    <div>
                        <div className='input-field'>
                            <label>date of birth*</label>
                            <input type="date" name="dob" id="dob" required={true} onChange={(event) => event.target.setCustomValidity('')} />
                        </div>
                        <div className='input-field'>
                            <label>zip (US)*</label>
                            <input type="text" name="zip" id="zip" required={true} pattern="\d\d\d\d\d" maxLength={5} />
                        </div>
                        <div className='input-field'>
                            <label>password*</label>
                            <input type="password" name="pass" id="pass" required={true} onChange={linkPassword} />
                        </div>
                        <div className='input-field'>
                            <label>confirm password*</label>
                            <input type="password" id="cpass" required={true} onChange={linkPassword} />
                        </div>
                    </div>
                </div>
                <input type="hidden" name="timestamp" value="" id="ts" onLoad={setTimestamp} />
            </div>
            <input className="button" value="submit" type="submit" style={{ width: '30%' }} />
        </form >
    )
}

export default RegistrationForm
