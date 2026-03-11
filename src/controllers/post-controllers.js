import { createPostService, deletePostService, findAllPostsService, findPostByIdService, updatePostService } from "#/services/post-service.js"
import { catchAsync } from "#/utils/catchAsync.js"
import { AppError } from "#/middleware/error.middleware.js"

export const getPosts = catchAsync(async (req, res) => {
    const posts = await findAllPostsService()
    res.status(200).json(posts);
}
)

export const getPostById = catchAsync(async (req, res) => {
    const id = req.params.id
    const post = await findPostByIdService(id)
    if (!post) {
        throw new AppError(`Could not find post by id ${id}`)
    }
    res.status(200).json(post)
}
)

export const createNewPost = catchAsync(async (req, res) => {
    const newPost = await createPostService(req.body)
    res.status(201).json(newPost)
}
)


export const updatePostById = catchAsync(async (req, res) => {
    const updated = await updatePostService(req.params.id, req.body)
    res.status(200).json(updated)
}
)


export const deletePostById = catchAsync(async (req, res) => {
    const id = req.params.id
    const deleted = await deletePostService(id)
    res.status(204).end()
}
)
