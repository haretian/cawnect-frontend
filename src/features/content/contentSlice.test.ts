import contentSlice, { addPosts, addFollower, deleteFollower, filterPosts } from "./contentSlice"
import { it, expect, describe } from "vitest"

describe("Test Article", () => {

    // REDUCERS CAN'T FETCH, reducer requires external fetch.
    it('should fetch articles for current logged in user', async () => {
        let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        let response = await req.json()

        let currState = contentSlice(undefined, addPosts({ posts: response }))
        expect(currState.posts.length).toEqual(10)
    });

    it('should add article', async () => {
        //let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        //let response = await req.json()

        //let currState = contentSlice(undefined, addPosts({ posts: response }))
        //currState = contentSlice(currState, addPost( { body: "i am a post" } ))
        //expect(currState.posts.length).toEqual(11)
    });

    it('should filter displayed articles by the search keyword', async () => {
        let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        let response = await req.json()
        response.forEach((elem: any) => { elem.username = 'Bret' })
        response.forEach((elem: any) => { elem.date = Date.now() })

        let currState = contentSlice(undefined, addPosts({ posts: response }))
        currState = contentSlice(currState, filterPosts({ filterString: "quia" }))
        expect(currState.posts.length).toEqual(3)
    });

    // REDUCERS CAN'T FETCH, reducer requires external fetch.
    it('should add articles when adding a follower', async () => {
        let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        let response = await req.json()
        response.forEach((elem: any) => { elem.username = 'Bret' })

        let currState = contentSlice(undefined, addPosts({ posts: response }))

        let followReq = await fetch('https://jsonplaceholder.typicode.com/users?id=2')
        let followRes = followReq.json()

        let postReq = await fetch('https://jsonplaceholder.typicode.com/posts?userId=2')
        let postRes = await postReq.json()

        currState = contentSlice(currState, addFollower({ follower: followRes, posts: postRes }))
        expect(currState.posts.length).toEqual(20)
    })

    // REDUCERS CAN'T FETCH, reducer requires external fetch.
    it('should remove articles when removing a follower', async () => {
        let req = await fetch('https://jsonplaceholder.typicode.com/posts?userId=1')
        let response = await req.json()
        response.forEach((elem: any) => { elem.username = 'Bret' })

        let currState = contentSlice(undefined, addPosts({ posts: response }))

        let followReq = await fetch('https://jsonplaceholder.typicode.com/users?id=2')
        let followRes = followReq.json()

        let postReq = await fetch('https://jsonplaceholder.typicode.com/posts?userId=2')
        let postRes = await postReq.json()

        currState = contentSlice(currState, addFollower({ follower: followRes, posts: postRes }))
        expect(currState.posts.length).toEqual(20)
        currState = contentSlice(currState, deleteFollower({ username: 'Antonette' }))
        expect(currState.posts.length).toEqual(10)
    });
});