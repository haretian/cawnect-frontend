import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Post from './Post'
import '../assets/styles.css'
import { useNavigate } from 'react-router-dom'

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

    return (
        <div className='main'>
            <div className="navbar">
                <h1 className="header-title">Welcome</h1>
                <button className="header-button" onClick={() => { navigate('/profile') }}>Profile</button>
            </div>
            {rows.map((row, i) => (
                <div key={i} className='row'>
                    {row.map((postobj, j) => <Post key={j} title={postobj.title} body={postobj.body} />)}
                    {Array(4-row.length).fill(1).map((_, i) => <div className='postempty'></div>)}
                </div>
            ))}
        </div>
    )
}

export default Home