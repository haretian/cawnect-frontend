import { useNavigate } from 'react-router-dom'
import '../assets/styles.css'

function Profile() {
    const navigate = useNavigate()

    const inputFields = document.getElementsByClassName('input');
    const info = document.getElementsByClassName('info');

    const updateEntries = () => {
        if (!validateEntries())
            return;

        const current = document.getElementsByClassName('current');

        for (let i = 0; i < inputFields.length - 2; i++) {
            let input = inputFields[i] as HTMLInputElement
            if (input.value) {
                current[i].innerHTML = input.value;
                input.value = '';
                info[i].innerHTML = 'Updated successfully.'
                let infoDiv = info[i] as HTMLDivElement
                infoDiv.style.display = 'block';
            }
        }

        // Password case
        if ((inputFields[4] as HTMLInputElement) .value) {
            current[4].innerHTML = '*'.repeat((inputFields[4] as HTMLInputElement).value.length);
            (inputFields[4] as HTMLInputElement) .value = '';
            (inputFields[5] as HTMLInputElement).value = '';
            info[4].innerHTML = 'Updated successfully.';
            (info[4] as HTMLDivElement).style.display = 'block';
        }
    }

    // Validation routine
    const validateEntries = () => {
        let valid = true;

        for (let i = 0; i < info.length; i++) {
            (info[i] as HTMLDivElement).style.display = 'none';
        }

        // Email
        if ((inputFields[1] as HTMLInputElement).value) {
            if ((inputFields[1] as HTMLInputElement).value.match(/^@/)) {
                info[1].innerHTML = 'Missing user (e.g. user@email.com).';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
            if (!(inputFields[1] as HTMLInputElement).value.match(/@.+\..+/)) {
                info[1].innerHTML = 'Missing domain name (e.g. @email.com).';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Phone
        if ((inputFields[2] as HTMLInputElement).value) {
            if (!(inputFields[2] as HTMLInputElement).value.match(/[0-9]{3}\-[0-9]{3}\-[0-9]{4}/)) {
                info[2].innerHTML = 'Invalid phone (e.g. 123-123-1234).';
                (info[2] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Zipcode
        if ((inputFields[3] as HTMLInputElement).value) {
            if (!(inputFields[3] as HTMLInputElement).value.match(/[0-9]{5}/)) {
                info[3].innerHTML = 'Invalid zip (e.g. 12345).';
                (info[3] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Password Fields
        if ((inputFields[4] as HTMLInputElement).value) {
            if (!(inputFields[5] as HTMLInputElement).value) {
                info[5].innerHTML = 'Please confirm password.';
                (info[5] as HTMLDivElement).style.display = 'block';
                valid = false;
            } else {
                if ((inputFields[4] as HTMLInputElement).value != (inputFields[5] as HTMLInputElement).value) {
                    info[5].innerHTML = 'Passwords do not match.';
                    (info[5] as HTMLDivElement).style.display = 'block';
                    valid = false;
                }
            }
        }
        if ((inputFields[5] as HTMLInputElement).value) {
            if (!(inputFields[4] as HTMLInputElement).value) {
                info[4].innerHTML = 'Please input password.';
                (info[4] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        return valid;
    }

    return (
        <div className="profile-main">
            <button onClick={() => navigate('/home')} >Home</button>
            <h1>Profile</h1>
            <div className="profile">
                <p>Display Name:</p>
                <p className="current">jdoe</p>
                <input className="input" id="dispInput" />
                <p className="info"></p>
            </div>
            <div className="profile">
                <p>Email Address:</p>
                <p className="current">jdoe@email.com</p>
                <input className="input" id="emailInput" />
                <p className="info"></p>
            </div>
            <div className="profile">
                <p>Phone Number:</p>
                <p className="current">123-123-1234</p>
                <input className="input" id="phoneInput" maxLength={12} />
                <p className="info"></p>
            </div>
            <div className="profile">
                <p>Zipcode (US): </p>
                <p className="current">12345</p>
                <input className="input" id="zipInput" maxLength={5} />
                <p className="info"></p>
            </div>
            <div className="profile">
                <p>Password: </p>
                <p className="current">*******</p>
                <input type="password" className="input" id="passInput" />
                <p className="info"></p>
            </div>
            <div className="profile">
                <p>Confirm Password: </p>
                <input type="password" className="input" id="cpassInput" />
                <p className="info" id="cpassInfo"></p>
            </div>
            <div className="profile" style={{ justifyContent: "right" }}>
                <button onClick={() => { updateEntries() }}>Update</button>
            </div>
        </div>
    )
}

export default Profile