
import { AppError } from "#/utils/AppError.js"
let posts = [
    { id: 1, title: "First post", content: "Hello" },
    { id: 2, title: "Second post", content: "World" }
]

export const findAllPostsService = () => {
    return posts
}

export const findPostByIdService = (id) => {
    const singlePost = posts.find((post) => post.id === id)
    if (!singlePost) {
        throw new AppError(`Could not find post by id ${id}`)
    }
    return singlePost
}

export const createPostService = (data) => {
    const newPost = {
        id: posts.length + 1,
        ...data
    }
    posts.push(newPost)
    return newPost
}

export const updatePostService = (id, data) => {
    const index = posts.findIndex(post => post.id === id)
    if (index === -1) {
        throw new AppError(`Could not find post by id ${id}`)
    }
    posts[index] = {
        ...posts[index],
        ...data
    }
    return posts[index]
}

export const deletePostService = (id) => {
    const index = posts.findIndex(post => post.id === id)
    if (index === -1) {
        throw new AppError(`Could not find post by id ${id}`)
    }
    const deleted = posts[index]
    posts = posts.filter(post => post.id !== id)
    return deleted
}