import express from "express"
import postRoutes from "#/routes/post-routes.js"
import { errorMiddleware } from "#/middleware/error.js"
import { notFound } from "#/middleware/notFound.js"
import morgan from "morgan"

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger
app.use(
    morgan('dev', {
        stream: {
            write: (message) => {
                process.stdout.write(`morgan - ${message}`);
            },
        },
    })
);

// Routes
app.use("/posts", postRoutes)

// Error Handler
app.use(notFound)
app.use(errorMiddleware)

// Health Check
app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})


export default app