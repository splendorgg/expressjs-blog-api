import { prisma } from "#/lib/prisma.js"
import { AppError } from "#/utils/AppError.js"

let posts = [
    { id: 1, title: "First post", content: "Hello" },
    { id: 2, title: "Second post", content: "World" }
]

export const findAllPostsService = async () => {
    const users = await prisma.user.findMany();
    console.log(users);
}

export const findPostByIdService = (id) => {
    const singlePost = posts.find((post) => post.id === id)
    if (!singlePost) {
        throw new AppError(`Could not find post by id ${id}`)
    }
    return singlePost
}

export const createPostService = async (data) => {

    const newPost = await prisma.post.create({
        data: {
            title: data.title,
            content: data.content,
            user: {
                connect: { id: "391c9199-d940-4cd2-92f0-08e149379f8d" }
            }
        }
    })
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