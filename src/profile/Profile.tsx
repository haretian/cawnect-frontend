import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserProfile, loginUser, logoutUser, /*updateAvatar*/ } from '../features/user/userSlice';
import { type UserState, url } from '../main'
import Navbar from '../navbar/Navbar';

import './profile.css'
import UserPhoto from '../assets/img/user_placeholder.jpg'
import AddPhoto from '../assets/icons/addphoto.svg'

declare global {
    interface HTMLInputElement {
        lastVal: number
    }
}

function Profile() {
    const username = useSelector((state: UserState) => state.user.username)
    const dispName = useSelector((state: UserState) => state.user.displayName)
    const email = useSelector((state: UserState) => state.user.userEmail)
    const phone = useSelector((state: UserState) => state.user.phone)
    const zip = useSelector((state: UserState) => state.user.zip)
    const passLen = useSelector((state: UserState) => state.user.passwordLen)
    const avatar = useSelector((state: UserState) => state.user.avatar)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const fileInput = useRef<HTMLInputElement | null>(null)

    const inputFields = document.getElementsByClassName('input');
    const info = document.getElementsByClassName('info');

    // Try and log in user from cookie if possible
    useEffect(() => {
        async function processUser() {
            // Try and get display name
            let response = await fetch(url('/users/1'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            // Can't make request means not logged in, log user out
            if (!response.ok) {
                dispatch(logoutUser());
                return
            }

            // Ok, log user in
            let res = await response.json();
            dispatch(loginUser({ username: res.username }));

            // Get necessary fields for profile

            // Process fetched display name
            let payload = {
                display: res.name,
                email: res.email,
                phone: res.phone,
                zipcode: res.address.zipcode,
                avatar: "",
            }

           // payload.display = res.display;

            // Get all values
/*             await Promise.all(Object.keys(payload).map(async (key) => {
                await getEntry(key, payload);
            })) */

            dispatch(updateUserProfile(payload))
        }

        processUser();
    }, [])

/*     const getEntry = async (key: string, object: any) => {
        try {
            const response = await fetch(url(`/${key}`), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })
            const res = await response.json();
            object[key] = res[key];
        } catch (err) {
            console.log(`cannot fetch ${key}`, err);
            object[key] = "failed to fetch";
        }
    } */

/*     const putEntry = async (key: string, object: any) => {
        if (!object[key])
            return;

        try {
            const response = await fetch(url(`/${key}`), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    [key]: object[key]
                }),
            })
            const res = await response.json();
            object[key] = res[key];
        } catch (err) {
            console.log(`cannot fetch PUT ${key}`, err);
            object[key] = "failed to fetch PUT";
        }
    } */

    // Redirect back home if username becomes empty (on logout)
    useEffect(() => {
        if (username === "")
            navigate("/login", { replace: true });
    }, [username])

    const updateEntries = async () => {
        if (!validateEntries())
            return;

        let payload = {
            display: "",
            email: "",
            phone: "",
            zipcode: ""
        }
        let password = "";

        // Display name
        let input = inputFields[0] as HTMLInputElement
        if (input.value) {
            payload.display = input.value

            input.value = '';
            info[0].innerHTML = 'updated successfully'
            let infoDiv = info[0] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Email address
        input = inputFields[1] as HTMLInputElement
        if (input.value) {
            payload.email = input.value
            input.value = '';
            info[1].innerHTML = 'updated successfully'
            let infoDiv = info[1] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // phone number
        input = inputFields[2] as HTMLInputElement
        if (input.value) {
            payload.phone = input.value
            input.value = '';
            info[2].innerHTML = 'updated successfully'
            let infoDiv = info[2] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Zip code
        input = inputFields[3] as HTMLInputElement
        if (input.value) {
            payload.zipcode = input.value
            input.value = '';
            info[3].innerHTML = 'updated successfully'
            let infoDiv = info[3] as HTMLDivElement
            infoDiv.style.display = 'block';
        }

        // Password case
        input = inputFields[4] as HTMLInputElement
        if (input.value) {
            password = input.value;
            input.value = '';
            (inputFields[5] as HTMLInputElement).value = '';
            info[4].innerHTML = 'updated successfully';
            (info[4] as HTMLDivElement).style.display = 'block';
        }

        // Put all values
        await Promise.all(Object.keys(payload).map(async (key) => {
            //await putEntry(key, payload);
            key;
        }))

        // Password case
        if (password) {
            try {
/*                 await fetch(url(`/password`), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include",
                    body: JSON.stringify({
                        password: password,
                    }),
                }) */
            } catch (err) {
                console.log(`cannot fetch PUT password`, err);
            }
        }

        dispatch(updateUserProfile(payload))
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
                info[1].innerHTML = 'missing user (e.g. user@email.com)';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
            if (!(inputFields[1] as HTMLInputElement).value.match(/@.+\..+/)) {
                info[1].innerHTML = 'missing domain name (e.g. @email.com)';
                (info[1] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Phone
        if ((inputFields[2] as HTMLInputElement).value) {
            if (!(inputFields[2] as HTMLInputElement).value.match(/[0-9]{3}\-[0-9]{3}\-[0-9]{4}/)) {
                info[2].innerHTML = 'invalid phone (e.g. 123-123-1234)';
                (info[2] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Zipcode
        if ((inputFields[3] as HTMLInputElement).value) {
            if (!(inputFields[3] as HTMLInputElement).value.match(/[0-9]{5}/)) {
                info[3].innerHTML = 'invalid zip (e.g. 12345)';
                (info[3] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        // Password Fields
        if ((inputFields[4] as HTMLInputElement).value) {
            if (!(inputFields[5] as HTMLInputElement).value) {
                info[5].innerHTML = 'please confirm password';
                (info[5] as HTMLDivElement).style.display = 'block';
                valid = false;
            } else {
                if ((inputFields[4] as HTMLInputElement).value != (inputFields[5] as HTMLInputElement).value) {
                    info[5].innerHTML = 'passwords do not match';
                    (info[5] as HTMLDivElement).style.display = 'block';
                    valid = false;
                }
            }
        }
        if ((inputFields[5] as HTMLInputElement).value) {
            if (!(inputFields[4] as HTMLInputElement).value) {
                info[4].innerHTML = 'please input password';
                (info[4] as HTMLDivElement).style.display = 'block';
                valid = false;
            }
        }

        return valid;
    }

    const uploadAvatar = () => {
        const fd = new FormData();

        // Confirm file exists
        let file = fileInput.current?.files ? fileInput.current?.files[0] : null;
        if (file) {
            fd.append('image', file);

            (async () => {
                try {
/*                     const response = await fetch(url("/avatar"), {
                        method: 'PUT',
                        credentials: "include",
                        body: fd,
                    })
                    const res = await response.json();

                    dispatch(updateAvatar({ avatar: res.avatar })); */
                } catch (err) {
                    console.log(`cannot fetch PUT avatar`, err);
                }
            })();
        }
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
            <Navbar>
                <button className="button header-button" onClick={() => { navigate('/') }}>home</button>
            </Navbar>
            <div className="profile-main">
                <div className="profile-info">
                    <img className='profile-photo' src={avatar ? avatar : UserPhoto}></img>
                    <label className='profile-upload' htmlFor='photo'>
                        <img src={AddPhoto} />
                    </label>
                    <input id='photo' ref={fileInput} type='file' className='hidden' onChange={uploadAvatar} accept='.png,.jpg,.jpeg' />
                    <h1 className='profile-title'>my profile</h1>
                    <div className='profile-current'>{dispName ? dispName : username}</div>
                    <div className='profile-current'>{email ? email : "n/a"}</div>
                    <div className='profile-current'>{phone ? phone : "n/a"}</div>
                    <div className='profile-current'>{zip ? zip : "n/a"}</div>
                    <div className='profile-current'>{"*".repeat(passLen)}</div>
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
                        <button className="button update-button" onClick={() => { updateEntries() }}>update info</button>
                    </div>
                </div>
            </div>
        </>

    )
}

export default Profile