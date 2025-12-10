import { useEffect, useRef, useState, type MouseEventHandler, type SyntheticEvent } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { type UserState, url } from '../main'
import { loginUser, logoutUser, updateAvatar, updateDisplay, updateStatus } from '../features/user/userSlice'
import { addPosts, setPosts, filterPosts, updateFollowing, addOrReplacePost } from '../features/content/contentSlice'
import Posts from './posts/Posts'
import Sidebar from './sidebar/Sidebar'
import Navbar from '../navbar/Navbar'

import './Home.css'
import Search from '../assets/icons/search.svg'

type FollowerInfo = {
    username: string,
    display: string,
    status: string,
    avatar: string,
}

type PopupFuncs = {
    cancelPost: MouseEventHandler
    newPost: MouseEventHandler
}

function Home() {
    const navigate = useNavigate()
    const username = useSelector((state: UserState) => state.user.username);
    const posts = useSelector((state: UserState) => state.content.posts);
    const [pagesLoaded, setPagesLoaded] = useState(0);
    const [atEnd, setEnd] = useState(false);
    let popupPostId: string | undefined = undefined;
    const dispatch = useDispatch()

    const background = useRef<HTMLDivElement | null>(null);
    const upload = useRef<HTMLInputElement | null>(null);
    const textarea = useRef<HTMLTextAreaElement | null>(null);
    const postpopup = useRef<HTMLDivElement | null>(null);

    const searchPosts = (e: SyntheticEvent) => {
        let input: string = (e.target as HTMLInputElement).value.toLowerCase();
        dispatch(filterPosts({ filterString: input }))
    }

    const openPopup = (id?: string, text?: string) => {
        popupPostId = id;
        console.log(popupPostId);
        postpopup.current?.classList.remove('popup-hidden');
        if (popupPostId)
            background.current?.classList.add('image-hidden');
        else
            background.current?.classList.remove('image-hidden');

        let content = document.getElementById('body') as HTMLTextAreaElement
        content.value = text ? text : "";
        content.focus();
    }

    const newPost = () => {
        let content = textarea.current?.value;
        if (!content)
            return
        if (content.replace(/\s/g, "") == "") {
            return
        }

        let popup = document.getElementById('postpopup')
        popup?.classList.add('popup-hidden')

        let search = document.getElementById('search') as HTMLInputElement
        search.value = ""

        // Submit post
        let file = upload.current?.files != null ? upload.current?.files[0] : undefined
        if (popupPostId === undefined) {
            addNewPost(content, file);
        } else
            addPost(content, popupPostId);

        // clear content
        if (textarea.current)
            textarea.current.value = ""
        if (upload.current)
            upload.current.value = ""
    }

    const cancelPost = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget)
            return;

        let content = document.getElementById('body') as HTMLInputElement
        let file = document.getElementById('image') as HTMLInputElement
        let image = document.getElementById('new-post-empty-image') as HTMLInputElement
        content.value = ""
        file.value = ""
        image.style.backgroundImage = "";

        let popup = document.getElementById('postpopup')
        popup?.classList.add('popup-hidden')

        popupPostId = undefined;
    }

    const addPost = async (text: string, articleId: string, commentId?: number) => {
        try {
            let response = await fetch(url(`/articles/${articleId}`), {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify({
                    text: text,
                    commentId: commentId
                }),
            })

            if (!response.ok)
                return;

            let res = await response.json();
            dispatch(addOrReplacePost({ post: res.articles[0] }));

        } catch (err) {
            console.log(`cannot update article`, err);
        }
    }

    const addNewPost = async (text: string, file?: File) => {
        const fd = new FormData();
        fd.append("text", text);
        if (file)
            fd.append("image", file);

        try {
            const response = await fetch(url("/article"), {
                method: 'POST',
                credentials: "include",
                body: fd,
            })

            const res = await response.json();
            console.log(res);

            dispatch(addOrReplacePost({ post: res.articles[0] }));
        } catch (err) {
            console.log(`cannot fetch POST article`, err);
        }
    }

    const logout = () => {
        (async () => {
            await fetch(url('/logout'), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            }).catch((err) => {
                console.log("cannot logout", err.toString());
            })

            dispatch(logoutUser());
        })();
    }

    const fetchFollowers = async () => {
        // Followers
        let response = await fetch(url('/following'), {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: "include",
        })

        if (response.ok) {
            let res = await response.json();
            let following: FollowerInfo[] = [];
            await Promise.all(res.following.map(
                async (element: string) => {
                    // Get headline for each follower
                    const followHeadline = await fetch(url(`/headline/${element}`), {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: "include",
                    })

                    if (!followHeadline.ok)
                        return

                    const followDisp = await fetch(url(`/display/${element}`), {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: "include",
                    })

                    if (!followDisp.ok)
                        return


                    const followAvatar = await fetch(url(`/avatar/${element}`), {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: "include",
                    })

                    if (!followAvatar.ok)
                        return

                    const headlineRes = await followHeadline.json();
                    const dispRes = await followDisp.json();
                    const avatarRes = await followAvatar.json();
                    const follower = {
                        username: headlineRes.username,
                        status: headlineRes.headline,
                        display: dispRes.display,
                        avatar: avatarRes.avatar,
                    }

                    following = [...following, follower]
                }
            ))

            dispatch(updateFollowing({
                following: following,
            }))
        }
    }

    // Fetch actions
    const fetchPosts = async (set?: boolean) => {
        let nextPage = set ? 1 : pagesLoaded + 1;
        try {
            let response = await fetch(url('/articles'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Request-Page': nextPage.toString() },
                credentials: "include",
            })

            if (!response.ok) {
                console.log("failed to fetch posts");
                return;
            }

            let res = await response.json();
            if (res.articles.length < 10)
                setEnd(true);

            if (set)
                dispatch(setPosts({ posts: res.articles }));
            else
                dispatch(addPosts({ posts: res.articles }));
        } catch (err) {
            console.log(err);
        }

        setPagesLoaded(nextPage);
    }

    const loadMorePosts = () => {
        fetchPosts();
    }

    const refetch = async () => {
        setEnd(false);
        await fetchFollowers();
        await fetchPosts(true);
    }

    // Try and log in user from cookie if possible
    useEffect(() => {
        async function processUser() {
            // Try and get headline
            let response = await fetch(url('/headline'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            // Can't make request means not logged in, log user out
            if (!response.ok) {
                dispatch(logoutUser());
                return
            }

            // Ok, log user in
            let res = await response.json();
            dispatch(loginUser({ username: res.username }));

            // Process headline
            dispatch(updateStatus({ status: res.headline }));

            // Get necessary fields for home

            // Display name
            response = await fetch(url('/display'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (response.ok) {
                res = await response.json();
                dispatch(updateDisplay({ display: res.display }));
            }

            // Avatar
            response = await fetch(url('/avatar'), {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
            })

            if (response.ok) {
                res = await response.json();
                dispatch(updateAvatar({ avatar: res.avatar }));
            }

            await fetchFollowers();

            await fetchPosts(true);
        }

        processUser();
    }, [])

    // Redirect back home if username becomes empty (on logout)
    useEffect(() => {
        if (username === "")
            navigate("/login", { replace: true });
    }, [username])

    const PostFooter = () => {
        if (atEnd) {
            return <p id="post-end">end of posts...</p>
        }
        else {
            return <button id="loadmore" className='button' onClick={loadMorePosts}>load more</button>
        }

    }

    function PostPopup(props: PopupFuncs) {
        const fileDataURL = (file: File) => new Promise((resolve, reject) => {
            let fr = new FileReader();
            fr.onload = () => resolve(fr.result);
            fr.onerror = reject;
            fr.readAsDataURL(file)
        });

        const changeLabel = async () => {
            let file = upload.current?.files != null ? upload.current?.files[0] : undefined;
            if (background.current && file)
                background.current.style.backgroundImage = `url(${await fileDataURL(file)})`
        }

        return <div id='postpopup' ref={postpopup} className='new-post-popup-background popup-hidden' onClick={props.cancelPost}>
            <div className='new-post-popup-container'>
                <div className='new-post-content'>
                    <div id='new-post-empty-image' ref={background}>
                        <label htmlFor='image' id='imagelabel' className="button filebutton">
                            upload image
                        </label>
                        <input id='image' type='file' accept='.png,.jpg,.jpeg' ref={upload} onChange={changeLabel} />
                    </div>
                    <textarea id='body' ref={textarea} placeholder='type here...' maxLength={500}></textarea>
                </div>
                <div className='new-post-buttons'>
                    <button className="button" onClick={props.cancelPost}>cancel</button>
                    <button className= "button" onClick={props.newPost}>post!</button>
                </div>
            </div>
        </div>
    }

    return (
        <>
            <Navbar>
                <button className="button header-button" onClick={() => { logout() }}>logout</button>
                <button className="button header-button" onClick={() => { navigate('/profile') }}>profile</button>
            </Navbar>
            <Sidebar refetch={refetch} />
            <div className='home-main'>
                <PostPopup cancelPost={cancelPost} newPost={newPost} />
                <div className='post-header'>
                    <div style={{ display: 'inline-flex' }}>
                        <img className="icon" src={Search}></img>
                        <input id='search' type='text' placeholder='search posts...' onChange={searchPosts} autoComplete='off'></input>
                    </div>
                    <button className='button small-button' onClick={() => { openPopup() }}>+ new post</button>
                </div>
                <Posts posts={posts} addPostFunc={addPost} openEditFunc={openPopup}/>
                <PostFooter />
            </div>
        </>
    )
}

export default Home