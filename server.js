import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import teams from "../backend/api/teams.route.js"

const app = express()

app.use(cors())
app.use(express.json())

// app.use(express.static('public'));

app.use("/api/v1/teams", teams)
app.get('/', (req, res) => {
  console.log(`request: ${new Date()}`);
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.use('/api/v2/teams', async (req, res) => {
  try {
    const db = client.db("baseball"); // Replace with your database name
    const teamsCollection = db.collection("teams"); // Replace with your teams collection name

    const teams = await teamsCollection.find().sort({ winStreak: -1 }).toArray();
    res.json(teams);
  } catch (err) {
    console.error("Error fetching data from MongoDB:", err);
    res.status(500).send("Error fetching data from MongoDB");
  }
});
app.use("*", (req, res) => res.status(404).json({error: "swing and a miss. page not found."}))



export default app
