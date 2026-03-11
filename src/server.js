import "#/config/env.js"
import app from "./app.js"
const PORT = process.env.PORT || 7100


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
