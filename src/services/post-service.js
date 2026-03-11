import { prisma } from "#/config/prisma.js"
import { AppError } from "#/middleware/error.middleware.js"

let posts = [
    { id: 1, title: "First post", content: "Hello" },
    { id: 2, title: "Second post", content: "World" }
]

export const findAllPostsService = async () => {
    const posts = await prisma.post.findMany();
    return posts
}

export const findPostByIdService = async (id) => {
    const singlePost = await prisma.post.findUnique({
        where: {
            id
        }
    })
    return singlePost
}

export const createPostService = async (data) => {
    try {

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
    } catch (error) {
        throw new AppError(error.message || "Could not create post", 500);
    }
}

export const updatePostService = async (id, data) => {
    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data
        })
        return updatedPost
    } catch (error) {
        if (error.code === "P2025") {
            throw new AppError(`Could not find post by id ${id}`, 404);
        }
        throw new AppError(error.message || "Could not update post", 500);
    }

}

export const deletePostService = async (id) => {
    try {
        const deletedPost = await prisma.post.delete({
            where: { id },
        })
        return deletedPost
    } catch (error) {
        if (error.code === "P2025") {
            throw new AppError(`Could not find post with id ${id}`, 404);
        }
        throw new AppError(error.message || "Could not delete post", 500);
    }
}