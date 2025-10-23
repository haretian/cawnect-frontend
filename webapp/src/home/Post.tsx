import './Post.css'
import Comment from '../assets/comment.svg'
import Edit from '../assets/edit.svg'

type PostParams = {
    body: any,
    image: any
}

function Post(post: PostParams) {
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
                <img className='icon' src={Edit} onClick={() => {}}/>
                <img className='icon' src={Comment} onClick={() => {}}/>
            </div>
        </div>
    )
}

export default Post