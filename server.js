import express from "express"
import cors from "cors"
import teams from "./api/teams.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/teams", teams)
app.use("*", (req, res) => res.status(404).json({error: "swing and a miss. page not found."}))

export default app
