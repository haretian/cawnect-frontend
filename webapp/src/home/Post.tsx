import './Post.css'

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
        </div>
    )
}

export default Post