import express from "express"
import postRoutes from "#/routes/post-routes.js"
import authRotes from "#/modules/auth/auth.routes.js"
import { errorMiddleware } from "#/middleware/error.middleware.js"
import { notFound } from "#/middleware/notFound.middleware.js"
import morgan from "morgan"
import helmet from "helmet"
import cors from "cors"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"

const app = express()

// Security
app.use(helmet())
app.use(
    helmet({
        contentSecurityPolicy: false
    })
);
app.use(cors())

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());

// Logger
app.use(
    morgan("dev", {
        stream: {
            write: (message) => {
                process.stdout.write(`morgan - ${message}`)
            },
        },
    })
)

// Rate limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later.",
})

app.use(limiter)

// Routes
app.use("/posts", postRoutes)
app.use("/users", authRotes)

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" })
})

// Errors
app.use(notFound)
app.use(errorMiddleware)

export default app