import './Post.css'
import Comment from '../assets/comment.svg'
import Edit from '../assets/edit.svg'

function Post({ body, image }) {
    const SetImage = () => {
        if (image)
            return <img className='images' src={image} />
        else
            return
    }

    return (
        <div className="post">
            <SetImage />
   {/*          <p className='post-title'>{title}</p> */}
            <p className='post-text'>{body}</p>
            <div className="post-buttons">
                <img className='icon' src={Edit} onClick={() => {}}/>
                <img className='icon' src={Comment} onClick={() => {}}/>
            </div>
        </div>
    )
}

export default Post