import './Posts.css'
import CommentIcon from '../../assets/icons/comment.svg'
import Edit from '../../assets/icons/edit.svg'
import { useSelector } from 'react-redux'
import type { UserState } from '../../main'
import { useRef, useState } from 'react'

import img1 from "../../assets/img/crow-placeholder-1.jpg"
import img2 from "../../assets/img/crow-placeholder-2.jpg"
import img3 from "../../assets/img/crow-placeholder-3.jpg"
import img4 from "../../assets/img/crow-placeholder-4.jpg"

const images = [img1, img2, img3, img4, ""]
function generateImage() {
    return images[Math.floor(Math.random() * images.length)]
}

type PostInfo = {
    addPostFunc: Function,
    openEditFunc: Function,
    id: string;
    author: string,
    text: string,
    image: (string | undefined),
    date: number,
    comments: CommentInfo[],
}

type Posts = {
    posts: PostInfo[],
    addPostFunc: Function,
    openEditFunc: Function,
}

function Posts(prop: Posts) {
    return <div className='posts-container'>
        {prop.posts.map((postobj: PostInfo, i) => {
            return <Post
                key={i}
                id={postobj.id}
                author={postobj.author}
                text={postobj.text}
                image={generateImage()}
                date={postobj.date}
                comments={postobj.comments}
                addPostFunc={prop.addPostFunc}
                openEditFunc={prop.openEditFunc}
                />
        })}
    </div>
}

function Post(post: PostInfo) {
    const username = useSelector((state: UserState) => state.user.username);
    const newInput = useRef<HTMLInputElement | null>(null);
    const newButton = useRef<HTMLButtonElement | null>(null);
    const [isComment, setIsComment] = useState(false);
    const [commentid, setCommentId] = useState(-1);
    const id = post.id;

    const SetImage = () => {
        if (post.image)
            return <img className='images' src={post.image} />
        else
            return
    }

    const UserPost = () => {
        if (post.author === username)
            return <img className='icon post-button' src={Edit} onClick={() => { post.openEditFunc(id, post.text) }} />
        else
            return
    }

    const toggleComments = (e: React.MouseEvent) => {
        let comment = (e.target as HTMLElement).parentNode?.parentNode?.parentNode?.lastChild as HTMLElement
        if (comment.classList.contains('comment-hidden'))
            comment.classList.remove('comment-hidden')
        else {
            if (isComment)
                toggleInput();
            comment.classList.add('comment-hidden')
        }
    }

    const toggleInput = () => {
        setIsComment(isComment ? false : true);
        if (!isComment) {
            newInput.current?.classList.remove('comment-input-hidden');
            setTimeout(() => { newInput.current?.focus() }, 200);
        } else {
            newInput.current?.classList.add('comment-input-hidden')
            if (newInput.current?.value != "") {
                // Submit new comment
                post.addPostFunc(newInput.current?.value, id, commentid);
            }

            if (newInput.current)
                newInput.current.value = "";
        }
    }

    const blurInput = (e: React.FocusEvent) => {
        if (e.relatedTarget != newButton.current && !(e.relatedTarget instanceof HTMLImageElement)) {
            setIsComment(false)
            if (e.target != null && e.target instanceof HTMLInputElement) {
                e.target.classList.add('comment-input-hidden')
                e.target.value = "";
                setCommentId(-1);
            }
        }
    }

    const openEdit = (commentid: number, text: string) => {
        return (e: React.FocusEvent) => {
            setCommentId(commentid);
            if (newInput.current)
                newInput.current.value = text;

            if (e.target === null || !(e.target instanceof HTMLImageElement) || !isComment)
                toggleInput();
            else {
                newInput.current?.focus();
            }
        }
    }

    return (
        <div className="post">
            <SetImage />
            <p className='post-author'>{post.author}</p>
            <p className='post-text'>{post.text}</p>
            <div className='post-footer'>
                <p className='post-text'>{new Date(post.date).toLocaleDateString()}</p>
                <div className="post-buttons">
                    <UserPost />
                    <img className='icon post-button' src={CommentIcon} onClick={toggleComments} />
                </div>
            </div>
            <div className="post-comments comment-hidden">
                {post.comments?.map((comment, i) => {
                    return <Comment
                        key={i}
                        author={comment.author}
                        text={comment.text}
                        commentid={i}
                        openComment={openEdit}
                    />
                })}
                <div className="post-comments-input">
                    <input ref={newInput} className="comment-input-hidden" onBlur={blurInput} autoComplete='off'></input>
                    <button ref={newButton} className='button small-button' onClick={toggleInput}>{
                        isComment ? (commentid === -1 ? "comment" : "edit") : "new comment"
                    }</button>
                </div>
            </div>
        </div>
    )
}

type CommentInfo = {
    openComment: Function,
    commentid: number,
    author: string,
    text: string
}

function Comment(prop: CommentInfo) {
    const commentid = prop.commentid;
    const username = useSelector((state: UserState) => state.user.username);

    const EditButton = () => {
        if (prop.author === username) {
            return <img className='icon comment-edit' src={Edit} onClick={prop.openComment(commentid, prop.text)} tabIndex={0}/>
        }
        else
            return <></>;
    }

    return <div className='comment'>
        <p className='comment-user'>{prop.author}</p>
        <p className='comment-text'>
            <EditButton />
            {prop.text}
        </p>
    </div>
}

export default Posts