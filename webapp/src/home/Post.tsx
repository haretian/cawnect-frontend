function Post({ title, body }) {
    return (
        <div className="post">
            <div className="images">
                <img
                    src="https://images.unsplash.com/photo-1755371034010-51c25321312d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
            </div>
            
            <p className='post-text'>{body}</p>
        </div>
    )
}

export default Post