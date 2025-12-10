import { createSlice } from '@reduxjs/toolkit'

const sortPosts = (posts: any) => {
    return posts.sort((a: any, b: any) => {
        return b.date - a.date;
    })
}

export const contentSlice = createSlice({
    name: 'content',
    initialState: {
        posts: [],
        internalPosts: [],
        followers: [],
    },
    reducers: {
        addPosts: (state: any, action) => {
            // Prevent duplicates
            state.internalPosts = [...state.internalPosts, ...action.payload.posts];

            //state.internalPosts = [...action.payload.posts, ...state.internalPosts]
            state.posts = sortPosts(state.internalPosts);
        },

        addOrReplacePost: (state: any, action) => {
            type postType = {
                id: string;
            }

            let idx = -1;
            let curr = 0;
            state.internalPosts.forEach((post: postType) => {
                if (post.id === action.payload.post.id)
                    idx = curr;
                curr += 1;
            });

            if (idx === -1) {
                state.internalPosts = [action.payload.post, ...state.internalPosts];
                state.posts = state.internalPosts;
            } else {
                state.internalPosts = state.internalPosts.toSpliced(idx, 1, action.payload.post);
                state.posts = sortPosts(state.internalPosts);
            }
        },


        setPosts: (state: any, action) => {
            state.internalPosts = action.payload.posts;
            state.posts = sortPosts(state.internalPosts);
        },

        addFollower: (state: any, action) => {
            state.followers = [...state.followers, action.payload.follower]
            //state.internalPosts = [...state.internalPosts, ...action.payload.posts]
            //state.posts = sortPosts(state.internalPosts)
        },

        updateFollowing: (state: any, action) => {
            state.followers = action.payload.following;
        },

        deleteFollower: (state: any, action) => {
            state.followers = state.followers.filter((follower: any) => {
                return action.payload.follower != follower.username
            })

            // Remove follower's posts too
            state.internalPosts = state.internalPosts.filter((post: any) => {
                return action.payload.follower != post.username
            })
            state.posts = sortPosts(state.internalPosts)
        },

        filterPosts: (state: any, action) => {
            state.posts = state.internalPosts.filter((elem: any) => {
                return elem.text.toLowerCase().includes(action.payload.filterString)
                    || elem.author.toLowerCase().includes(action.payload.filterString)
            })
        },
    }
})

export const {
    setPosts,
    addOrReplacePost,
    addPosts,
    addFollower,
    updateFollowing,
    deleteFollower,
    filterPosts,
} = contentSlice.actions

export default contentSlice.reducer