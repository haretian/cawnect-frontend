import { useEffect, useState, type SyntheticEvent } from 'react'
import { useSelector } from 'react-redux'
import type { UserState } from '../../main'
import userImg from '../../assets/img/user_placeholder.jpg'
import './Sidebar.css'

type FriendInfo = {
    name: string,
    id: number
}

function Sidebar() {
    const displayName = useSelector((state: UserState) => state.user.displayName)
    const userid = useSelector((state: UserState) => state.user.userid)
    const [status, setStatus] = useState("caw!")
    const [editStatus, setEditStatus] = useState(false)
    const [friends, setFriends] = useState([])
    const [editFoll, setEditFoll] = useState(false)
    const [MAXDISPLAY, setMAX] = useState(5)

    // Toggles the status update bar
    const toggleStatus = () => {
        const inputElem = document.getElementById('status') as HTMLInputElement
        setEditStatus(editStatus ? false : true)
        if (!editStatus) {
            inputElem.classList.remove('sidebar-hidden')
            setTimeout(() => { inputElem.focus() }, 200)
        } else {
            inputElem.classList.add('sidebar-hidden')
            if (inputElem.value != "")
                setStatus(inputElem.value);
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
                let exists = false
                friends.forEach((element: FriendInfo) => {
                    if (element.name == inputElem.value)
                        exists = true
                });
                if (!exists)
                    setFriends([...friends, { name: inputElem.value } as never]);
            }
            inputElem.value = "";
        }
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

    const deleteFollower = (e: SyntheticEvent) => {
        setFriends(friends.filter((elem: FriendInfo, _) => { return (e.target as HTMLElement).id != (elem.name + 'pfp') }))
    }

    const ExtraFollowers = () => {
        if (friends.length > MAXDISPLAY) {
            return <div id="morefollowers" className='morefollowers'>{'+' + (friends.length - MAXDISPLAY) + ' more...'}</div>
        }
        return
    }

    // Get the current friend list
    useEffect(() => {
        async function getUserFriends() {
            let req = await fetch('https://jsonplaceholder.typicode.com/users')
            let response = await req.json()
            setFriends(response.filter((element : FriendInfo) => {
                if (userid == 0)
                    return false
                return (element.id == (userid + 1) % 10 || element.id == (userid + 2) % 10 || element.id == (userid + 3) % 10)
            }))
        }

        getUserFriends()
    }, []);

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
                <img className="profile-img" src={userImg}></img>
                <div className="profile-username">{displayName}</div>
                <div className="profile-status-text fake-italic">{status}</div>
                <input id="status" className='edit-status-popup sidebar-hidden' onBlur={blurInput} autoComplete="off"></input>
                <button id="status-button" className='small-button' onClick={toggleStatus}>{editStatus ? "update" : "new status"}</button>
            </div>
            <div className="splitter"></div>
            <div className="sidebar-follows">
                <div className='followers'>
                    {friends.map((elem: FriendInfo, i) => {
                        if (i > MAXDISPLAY - 1) {
                            return;
                        }
                        return <div className="follows-user" key={i}>
                            <img id={elem.name + "pfp"} className="follows-user-img" key={String(i) + "img"} src={userImg} onClick={deleteFollower} />
                            <div key={String(i) + "base"}>
                                <div className="follows-user-name" key={String(i) + "username"}>{elem.name}</div>
                                <div className="fake-italic" key={String(i) + "status"}>{"caw!"}</div>
                            </div>
                        </div>
                    })}
                </div>
                <div className='follows-input-container'>
                    <ExtraFollowers />
                    <input id="follower" className='edit-status-popup sidebar-hidden' onBlur={blurInputFoll} autoComplete="off"></input>
                    <button id="follow-button" className="small-button" onClick={toggleFollower}>{editFoll ? "add" : "add follower"}</button>
                </div>
            </div>
        </div>
    </div>
}

export default Sidebar