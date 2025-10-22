import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Post from './Post'
import Sidebar from './Sidebar'
import '../assets/styles.css'
import './Home.css'
import Logo from '../assets/logo_light.svg'

function Home() {
    const navigate = useNavigate()
    const userid = useSelector((state) => state.user.userid)
    var [posts, setPosts] = useState([])

    useEffect(() => {
        async function getUserPosts() {
            console.log(userid)
            let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=' + encodeURIComponent(userid))
            let response = await req.json()
            setPosts(response)
        }

        getUserPosts()
    }, [])

    const rowArr = [...Array(Math.ceil(posts.length / 4))]
    const rows = rowArr.map((_, idx) => posts.slice(idx * 4, idx * 4 + 4))
    const Posts = ({ rows }) => {
        return <div className='posts-container'>
            {rows.map((row, i) => (
                <div key={i} className='row'>
                    {row.map((postobj, j) => <Post key={j} title={postobj.title} body={postobj.body} />)}
                    {Array(4 - row.length).fill(1).map((_, i) => <div className='postempty'></div>)}
                </div>
            ))}
        </div>
    }

    return (
        <>
            <div className="navbar">
                <div>
                    <img className='logo' src={Logo} />
                    <h1 className='logo-text'>caw!nect</h1>
                </div>
                <div>
                    <button className="header-button" onClick={() => { navigate('/') }}>logout</button>
                    <button className="header-button" onClick={() => { navigate('/profile') }}>profile</button>
                </div>
            </div>
            <Sidebar />
            <div className='home-main'>
                <Posts rows={rows} />
            </div>
        </>
    )
}

export default Home