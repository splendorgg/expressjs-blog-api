import express from "express"
import { logger } from "#/middleware/logger.js"
import postRoutes from "#/routes/post-routes.js"
import { errorHandler } from "#/middleware/error.js"
import { notFound } from "#/middleware/notFound.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger
app.use(logger)

// Routes
app.use("/posts", postRoutes)

// Error Handler
app.use(notFound)
app.use(errorHandler)

// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})


export default app