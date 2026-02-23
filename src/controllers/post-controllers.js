import { createPostService, deletePostService, findAllPostsService, findPostByIdService, updatePostService } from "#/services/post-service.js"
import { catchAsync } from "#/utils/catchAsync.js"
import { AppError } from "#/utils/AppError.js"

export const getPosts = catchAsync(async (req, res) => {
    const posts = findAllPostsService()
    res.json(posts)
}
)

export const getPostById = catchAsync(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        throw new AppError("Invalid post id", 400)
    }
    const post = findPostByIdService(id)
    res.json(post)
}
)

export const createNewPost = catchAsync(async (req, res) => {
    const newPost = createPostService(req.body)
    
    console.log();
    res.status(201).json(newPost)
}
)


export const updatePostById = catchAsync(async (req, res) => {
    const updated = updatePostService(req.params.id, req.body)
    res.json(updated)
}
)


export const deletePostById = catchAsync(async (req, res) => {
    const id = Number(req.params.id)
    if (Number.isNaN(id)) {
        throw new AppError("Invalid post id", 400)
    }
    deletePostService(id)
    res.status(204).end()
}
)
