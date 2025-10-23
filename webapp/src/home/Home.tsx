import { useEffect, useReducer, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from './Post'
import Sidebar from './Sidebar'
import '../assets/styles.css'
import './Home.css'
import Logo from '../assets/logo_light.svg'
import Search from '../assets/search.svg'

import temp1 from '../assets/crow-placeholder-1.jpg'
import temp2 from '../assets/crow-placeholder-2.jpg'
import temp3 from '../assets/crow-placeholder-3.jpg'
const images = [
    temp1,
    temp2,
    temp3,
    null
]

function Home() {
    const navigate = useNavigate()
    const userid = useSelector((state) => state.user.userid)
    const [posts, setPosts] = useState([])
    const [displayPosts, setDisplayPosts] = useState([])

    const filterPosts = (e) => {
        setDisplayPosts(posts.filter((elem) => {
            return elem.body.includes(e.target.value)
        }))
    }

    const changeLabel = (e) => {
        let label = document.getElementById("imagelabel")
        label.innerHTML = e.target.value
    }

    // NO ID YET
    const addPost = (e) => {
        let content = document.getElementById('body') as HTMLInputElement
        if (content.value == "") {
            return
        }

        let popup = document.getElementById('postpopup')
        popup.classList.add('hidden')

        let search = document.getElementById('search') as HTMLInputElement
        search.value = ""
        setPosts([{ body: content.value, userId: userid } as never, ...posts])
        setDisplayPosts([{ body: content.value, userId: userid } as never, ...displayPosts])
    }

    const cancelPost = (e) => {
        let content = document.getElementById('body') as HTMLInputElement
        let file = document.getElementById('image') as HTMLInputElement
        content.value = ""
        file.value = ""

        let popup = document.getElementById('postpopup')
        popup.classList.add('hidden')
    }

    const PostPopup = () => {
        return <div id='postpopup' className='new-post-popup-background hidden'>
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
                    <button onClick={cancelPost}>cancel</button>
                    <button onClick={addPost}>post!</button>
                </div>
            </div>
        </div>
    }

    useEffect(() => {
        async function getUserPosts() {
            let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + encodeURIComponent(userid))
            let response = await req.json()
            response.forEach((elem) => { elem.image = images[Math.floor(Math.random() * images.length)] })
            setDisplayPosts(response)
            setPosts(response)
        }

        getUserPosts()
    }, [])

    return (
        <>
            <div className="navbar">
                <div>
                    <img className='navbar-logo' src={Logo} />
                    <h1 className='navbar-logo-text'>caw!nect</h1>
                </div>
                <div>
                    <button className="header-button" onClick={() => { navigate('/') }}>logout</button>
                    <button className="header-button" onClick={() => { navigate('/profile') }}>profile</button>
                </div>
            </div>
            <Sidebar />
            <div className='home-main'>
                <PostPopup />
                <div className='post-header'>
                    <div style={{ display: 'inline-flex' }}>
                        <img className="icon" src={Search}></img>
                        <input id='search' type='text' placeholder='search posts...' onChange={filterPosts}></input>
                    </div>
                    <button className='small-button' onClick={() => document.getElementById('postpopup')?.classList.remove('hidden')}>+ new post</button>
                </div>
                <div className='posts-container'>
                    {displayPosts.map((postobj, i) => { return <Post key={i} body={postobj.body} image={postobj.image} /> })}
                </div>
            </div>
        </>
    )
}

export default Home