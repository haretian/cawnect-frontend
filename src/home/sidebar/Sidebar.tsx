import { useEffect, useState, type SyntheticEvent } from 'react'
import { /*useDispatch,*/ useSelector } from 'react-redux'
import { url, type UserState } from '../../main'
//import { updateStatus } from '../../features/user/userSlice'
import userImg from '../../assets/img/user_placeholder.jpg'
import './Sidebar.css'

type FollowerInfo = {
    username: string,
    status: string,
    display: string,
    avatar: string,
}

// Only needs a prop to assign random images
type imageProp = {
    refetch: Function
}

function Sidebar(prop: imageProp) {
    const displayName = useSelector((state: UserState) => state.user.displayName)
    const status = useSelector((state: UserState) => state.user.status)
    const username = useSelector((state: UserState) => state.user.username)
    const avatar = useSelector((state: UserState) => state.user.avatar)
    const followers = useSelector((state: UserState) => state.content.followers)
    const [editStatus, setEditStatus] = useState(false)
    const [editFoll, setEditFoll] = useState(false)
    const [buttonMessage, setButtonMessage] = useState("")
    const [MAXDISPLAY, setMAX] = useState(5)
    //const dispatch = useDispatch()

    // Toggles the status update bar
    const toggleStatus = () => {
        const inputElem = document.getElementById('status') as HTMLInputElement
        setEditStatus(editStatus ? false : true)
        if (!editStatus) {
            inputElem.classList.remove('sidebar-hidden')
            setTimeout(() => { inputElem.focus() }, 200)
        } else {
            inputElem.classList.add('sidebar-hidden')
            if (inputElem.value != "") {
                // Submit headline
                //let headline = inputElem.value;
/*                 (async () => {
                    // Set headline
                    let response = await fetch(url('/headline'), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ headline: headline }),
                        credentials: "include",
                    })

                    if (response.ok)
                        dispatch(updateStatus({ status: headline }));
                })(); */
            }
            inputElem.value = "";
        }
    }

    const blurInput = (e: React.FocusEvent) => {
        const inputButton = document.getElementById('status-button') as HTMLInputElement
        if (e.relatedTarget != inputButton) {
            setEditStatus(false)
            if (e.target != null && e.target instanceof HTMLInputElement) {
                e.target.classList.add('sidebar-hidden')
                e.target.value = "";
            }
        }
    }

    const toggleFollower = () => {
        const inputElem = document.getElementById('follower') as HTMLInputElement
        setEditFoll(editFoll ? false : true)
        if (!editFoll) {
            inputElem.classList.remove('sidebar-hidden')
            setTimeout(() => { inputElem.focus() }, 200)
        } else {
            inputElem.classList.add('sidebar-hidden')
            if (inputElem.value != "") {
                if (inputElem.value == username)
                    followMessage("can't follow")
                else {
                    let alreadyExists = false
                    followers.forEach((element: FollowerInfo) => {
                        if (element.username === inputElem.value)
                            alreadyExists = true
                    });
                    if (!alreadyExists) {
                        newFollower(inputElem.value)
                    } else {
                        followMessage("following")
                    }
                }
            }
            inputElem.value = "";
        }
    }

    const newFollower = async (username: string) => {
        console.log(`adding follower ${username}`)
        // Submit follower
/*         let response = await fetch(url(`/following/${username}`), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })

        if (response.status === 404) {
            followMessage("doesn't exist");
        }

        if (response.ok) {
            prop.refetch();
        } */
    }

    const deleteFollowerHandler = async (e: SyntheticEvent) => {
        let follower = (e.target as HTMLElement).id.slice(0, -3);

        // Delete follower
        let response = await fetch(url(`/following/${follower}`), {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })

        if (response.ok) {
            prop.refetch();
        }
    }

    const followMessage = (message: string) => {
        setButtonMessage(message)
        setTimeout(() => { setButtonMessage("") }, 1500)
    }

    const blurInputFoll = (e: React.FocusEvent) => {
        const inputButton = document.getElementById('follow-button') as HTMLInputElement
        if (e.relatedTarget != inputButton) {
            setEditFoll(false)
            if (e.target != null && e.target instanceof HTMLInputElement) {
                e.target.classList.add('sidebar-hidden')
                e.target.value = "";
            }
        }
    }

    const ExtraFollowers = () => {
        if (followers.length > MAXDISPLAY) {
            return <div id="morefollowers" className='morefollowers'>{'+' + (followers.length - MAXDISPLAY) + ' more...'}</div>
        }
        return
    }

    const FollowButton = () => {
        if (buttonMessage == "")
            return <button id="follow-button" className="button small-button" onClick={toggleFollower}>{editFoll ? "add" : "add follower"}</button>
        else
            return <button id="follow-button" className="button small-button" onClick={toggleFollower}>{buttonMessage}</button>
    }

    // For updating MAXDISPLAY when status changes
    useEffect(() => {
        // Update MAXDISPLAY
        let el = document.getElementsByClassName('profile-status-text')[0] as HTMLDivElement;
        let divHeight = el.offsetHeight
        let lineHeight = parseInt(window.getComputedStyle(el, null).getPropertyValue('line-height'));
        let lines = divHeight / lineHeight;

        if (lines >= 2) {
            setMAX(4)
        } else {
            setMAX(5)
        }
    }, [status])

    return <div className="sidebar-container">
        <div className="sidebar">
            <div className="sidebar-profile">
                <img className="profile-img" src={avatar ? avatar : userImg}></img>
                <div className="profile-username">{displayName ? displayName : username}</div>
                <div className="profile-status-text fake-italic">{status}</div>
                <input id="status" className='edit-status-popup sidebar-hidden' onBlur={blurInput} autoComplete="off"></input>
                <button id="status-button" className='button small-button' onClick={toggleStatus}>{editStatus ? "update" : "new status"}</button>
            </div>
            <div className="splitter"></div>
            <div className="sidebar-follows">
                <div className='followers'>
                    {followers.map((elem: FollowerInfo, i) => {
                        if (i > MAXDISPLAY - 1) {
                            return;
                        }
                        return <div className="follows-user" key={i}>
                            <img id={elem.username + "pfp"} className="follows-user-img" key={String(i) + "img"} src={elem.avatar ? elem.avatar : userImg} onClick={deleteFollowerHandler} />
                            <div key={String(i) + "base"}>
                                <div className="follows-user-name" key={String(i) + "username"}>
                                    {elem.display ? elem.display : elem.username}
                                    <span className="add-text">{
                                    (elem.display === elem.username || elem.display === "") ? "" : ` (${elem.username})`
                                    }</span>
                                </div>
                                <div className="fake-italic" key={String(i) + "status"}>{elem.status}</div>
                            </div>
                        </div>
                    })}
                </div>
                <div className='follows-input-container'>
                    <ExtraFollowers />
                    <input id="follower" className='edit-status-popup sidebar-hidden' onBlur={blurInputFoll} autoComplete="off"></input>
                    <FollowButton />
                </div>
            </div>
        </div>
    </div>
}

export default Sidebar