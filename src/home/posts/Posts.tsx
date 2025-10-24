import './Posts.css'
import Comment from '../../assets/icons/comment.svg'
import Edit from '../../assets/icons/edit.svg'

type PostInfo = {
    body: any,
    image: any
}

type Posts = {
    posts: PostInfo[]
}

function Posts(prop: Posts) {
    return <div className='posts-container'>
        {prop.posts.map((postobj: PostInfo, i) => { return <Post key={i} body={postobj.body} image={postobj.image} /> })}
    </div>
}

function Post(post: PostInfo) {
    const SetImage = () => {
        if (post.image)
            return <img className='images' src={post.image} />
        else
            return
    }

    return (
        <div className="post">
            <SetImage />
            {/*          <p className='post-title'>{title}</p> */}
            <p className='post-text'>{post.body}</p>
            <div className="post-buttons">
                <img className='icon post-button' src={Edit} onClick={() => { }} />
                <img className='icon post-button' src={Comment} onClick={() => { }} />
            </div>
        </div>
    )
}

export default Posts