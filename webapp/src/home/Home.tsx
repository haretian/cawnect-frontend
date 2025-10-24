import { useEffect, useState, type MouseEventHandler, type SyntheticEvent } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { UserState } from '../main'
import Posts from './posts/Posts'
import Sidebar from './sidebar/Sidebar'
import Navbar from '../navbar/Navbar'

import './Home.css'
import Search from '../assets/icons/search.svg'

import temp1 from '../assets/img/crow-placeholder-1.jpg'
import temp2 from '../assets/img/crow-placeholder-2.jpg'
import temp3 from '../assets/img/crow-placeholder-3.jpg'
import temp4 from '../assets/img/crow-placeholder-4.jpg'
const images = [
    temp1,
    temp2,
    temp3,
    temp4,
    null
]

type PostInfo = {
    body: string,
    image: (string | null)
}

type PopupFuncs = {
    cancelPost: MouseEventHandler
    addPost: MouseEventHandler
}

function PostPopup(props: PopupFuncs) {
    const changeLabel = (e: SyntheticEvent) => {
        let label = document.getElementById("imagelabel")
        if (label != null)
            label.innerHTML = (e.target as HTMLInputElement).value
    }

    return <div id='postpopup' className='new-post-popup-background popup-hidden' onClick={props.cancelPost}>
        <div className='new-post-popup-container'>
            <div className='new-post-content'>
                <div className='new-post-empty-image'>
                    <label htmlFor='image' id='imagelabel' className="button filebutton">
                        upload image
                    </label>
                    <input id='image' type='file' accept="image/png, image/jpeg" onChange={changeLabel} />
                </div>
                <textarea id='body' placeholder='type here...' maxLength={500}></textarea>
            </div>
            <div className='new-post-buttons'>
                <button onClick={props.cancelPost}>cancel</button>
                <button onClick={props.addPost}>post!</button>
            </div>
        </div>
    </div>
}

function Home() {
    const navigate = useNavigate()
    const userid = useSelector((state: UserState) => state.user.userid)
    const [posts, setPosts] = useState([])
    const [displayPosts, setDisplayPosts] = useState([])

    const filterPosts = (e: SyntheticEvent) => {
        setDisplayPosts(posts.filter((elem: PostInfo) => {
            return elem.body.includes((e.target as HTMLInputElement).value)
        }))
    }

    // NO ID YET
    const addPost = () => {
        let content = document.getElementById('body') as HTMLInputElement
        if (content.value == "") {
            return
        }

        let popup = document.getElementById('postpopup')
        popup?.classList.add('popup-hidden')

        let search = document.getElementById('search') as HTMLInputElement
        search.value = ""
        setPosts([{ body: content.value, userId: userid } as never, ...posts])
        setDisplayPosts([{ body: content.value, userId: userid } as never, ...displayPosts])
    }

    const cancelPost = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget)
            return;

        let content = document.getElementById('body') as HTMLInputElement
        let file = document.getElementById('image') as HTMLInputElement
        content.value = ""
        file.value = ""

        let popup = document.getElementById('postpopup')
        popup?.classList.add('popup-hidden')
    }

    useEffect(() => {
        async function getUserPosts() {
            let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + encodeURIComponent(userid))
            let response = await req.json()
            response.forEach((elem: PostInfo) => { elem.image = images[Math.floor(Math.random() * images.length)] })
            setDisplayPosts(response)
            setPosts(response)
        }

        getUserPosts()
    }, [])

    return (
        <>
            <Navbar>
                <button className="header-button" onClick={() => { navigate('/') }}>logout</button>
                <button className="header-button" onClick={() => { navigate('/profile') }}>profile</button>
            </Navbar>
            <Sidebar />
            <div className='home-main'>
                <PostPopup cancelPost={cancelPost} addPost={addPost}/>
                <div className='post-header'>
                    <div style={{ display: 'inline-flex' }}>
                        <img className="icon" src={Search}></img>
                        <input id='search' type='text' placeholder='search posts...' onChange={filterPosts} autoComplete='off'></input>
                    </div>
                    <button className='small-button' onClick={() => document.getElementById('postpopup')?.classList.remove('popup-hidden')}>+ new post</button>
                </div>
                <Posts posts={displayPosts} />
            </div>
        </>
    )
}

export default Home