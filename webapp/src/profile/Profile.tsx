import { useNavigate } from 'react-router-dom'
import '../assets/styles.css'
import './profile.css'
import Logo from '../assets/logo_light.svg'
import UserPhoto from '../assets/user_placeholder.jpg'
import AddPhoto from '../assets/addphoto.svg'
import { setUserProfile } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux'
import type { UserState } from '../main'

declare global {
    interface HTMLInputElement {
        lastVal: number
    }
}

function Profile() {
    const navigate = useNavigate()
    const dispName = useSelector((state: UserState) => state.user.displayName)
    const email = useSelector((state: UserState) => state.user.userEmail)
    const phone = useSelector((state: UserState) => state.user.phone)
    const zip = useSelector((state: UserState) => state.user.zip)
    const dispatch = useDispatch()

    const inputFields = document.getElementsByClassName('input');
    const info = document.getElementsByClassName('info');

    const updateEntries = () => {
        if (!validateEntries())
            return;

        let payload = {
            displayName: "",
            email: "",
            phone: "",
            zip: "",
            password: ""
        }

        // Display name
        let input = inputFields[0] as HTMLInputElement
        if (input.value) {
            payload.displayName = input.value
            input.value = '';
            info[0].innerHTML = 'updated successfully.'
            let infoDiv = info[0] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Email address
        input = inputFields[1] as HTMLInputElement
        if (input.value) {
            payload.email = input.value
            input.value = '';
            info[1].innerHTML = 'updated successfully.'
            let infoDiv = info[1] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // phone number
        input = inputFields[2] as HTMLInputElement
        if (input.value) {
            payload.phone = input.value
            input.value = '';
            info[2].innerHTML = 'updated successfully.'
            let infoDiv = info[2] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Zip code
        input = inputFields[3] as HTMLInputElement
        if (input.value) {
            payload.zip = input.value
            input.value = '';
            info[3].innerHTML = 'updated successfully.'
            let infoDiv = info[3] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Password case
        input = inputFields[4] as HTMLInputElement
        if (input.value) {
            payload.password = input.value;
            input.value = '';
            (inputFields[5] as HTMLInputElement).value = '';
            info[4].innerHTML = 'updated successfully.';
            (info[4] as HTMLDivElement).style.display = 'block';
        }

        dispatch(setUserProfile(payload))
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
                info[1].innerHTML = 'missing user (e.g. user@email.com).';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
            if (!(inputFields[1] as HTMLInputElement).value.match(/@.+\..+/)) {
                info[1].innerHTML = 'missing domain name (e.g. @email.com).';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Phone
        if ((inputFields[2] as HTMLInputElement).value) {
            if (!(inputFields[2] as HTMLInputElement).value.match(/[0-9]{3}\-[0-9]{3}\-[0-9]{4}/)) {
                info[2].innerHTML = 'invalid phone (e.g. 123-123-1234).';
                (info[2] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Zipcode
        if ((inputFields[3] as HTMLInputElement).value) {
            if (!(inputFields[3] as HTMLInputElement).value.match(/[0-9]{5}/)) {
                info[3].innerHTML = 'invalid zip (e.g. 12345).';
                (info[3] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Password Fields
        if ((inputFields[4] as HTMLInputElement).value) {
            if (!(inputFields[5] as HTMLInputElement).value) {
                info[5].innerHTML = 'please confirm password.';
                (info[5] as HTMLDivElement).style.display = 'block';
                valid = false;
            } else {
                if ((inputFields[4] as HTMLInputElement).value != (inputFields[5] as HTMLInputElement).value) {
                    info[5].innerHTML = 'passwords do not match.';
                    (info[5] as HTMLDivElement).style.display = 'block';
                    valid = false;
                }
            }
        }
        if ((inputFields[5] as HTMLInputElement).value) {
            if (!(inputFields[4] as HTMLInputElement).value) {
                info[4].innerHTML = 'please input password.';
                (info[4] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        return valid;
    }

    // Allow only numeric
    const allowOnlyNumeric = (evt: React.FormEvent) => {
        let target = evt.currentTarget as HTMLInputElement
        target.value = target.value.replace(/[^0-9]/g, '');
    }

    const formatPhone = (evt: React.FormEvent) => {
        const phone = evt.currentTarget as HTMLInputElement;
        allowOnlyNumeric(evt);

        // Insert formatting
        if (phone.value.length > 3 && phone.value.charAt(3) != '-')
            phone.value = phone.value.slice(0, 3) + '-' + phone.value.slice(3);
        if (phone.value.length > 7 && phone.value.charAt(7) != '-')
            phone.value = phone.value.slice(0, 7) + '-' + phone.value.slice(7);
        // Correct backspace behavior
        if ((phone.value.length == 3 && phone.lastVal == 4) || (phone.value.length == 7 && phone.lastVal == 8))
            phone.value = phone.value.slice(0, -1);
        phone.lastVal = phone.value.length;
    }

    return (
        <>
            <div className="navbar">
                <div>
                    <img className='navbar-logo' src={Logo} />
                    <h1 className='navbar-logo-text'>caw!nect</h1>
                </div>
                <div>
                    <button className="header-button" onClick={() => { navigate('/home') }}>home</button>
                </div>
            </div>
            <div className="profile-main">
                <div className="profile-info">
                    <img className='profile-photo' src={UserPhoto}></img>
                    <label className='profile-upload' htmlFor='photo'>
                        <img src={AddPhoto} />
                    </label>
                    <input id='photo' type='file' className='hidden'/>
                    <h1 className='profile-title'>my profile</h1>
                    <div className='profile-current'>{dispName}</div>
                    <div className='profile-current'>{email}</div>
                    <div className='profile-current'>{phone}</div>
                    <div className='profile-current'>{zip}</div>
                </div>
                <div className='update-fields'>
                    <div className="profile">
                        <p>display name</p>
                        <input className="input" id="dispInput" />
                        <p className="info"></p>
                    </div>
                    <div className="profile">
                        <p>email address</p>
                        <input className="input" id="emailInput" />
                        <p className="info"></p>
                    </div>
                    <div className="profile">
                        <p>phone number</p>
                        <input className="input" id="phoneInput" maxLength={12} onInput={formatPhone} />
                        <p className="info"></p>
                    </div>
                    <div className="profile">
                        <p>zipcode (US)</p>
                        <input className="input" id="zipInput" maxLength={5} onInput={allowOnlyNumeric} />
                        <p className="info"></p>
                    </div>
                    <div className="profile">
                        <p>password</p>
                        <input type="password" className="input" id="passInput" />
                        <p className="info"></p>
                    </div>
                    <div className="profile">
                        <p>confirm password</p>
                        <input type="password" className="input" id="cpassInput" />
                        <p className="info" id="cpassInfo"></p>
                    </div>
                    <div className="profile-button-container">
                        <button className="update-button" onClick={() => { updateEntries() }}>update info</button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Profile