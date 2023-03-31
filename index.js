import app from "./server.js"
import {
    MongoClient
} from "mongodb"
import dotenv from "dotenv"
import TeamsDAO from "./dao/teamsDAO.js"
import fetch from "node-fetch"
import dayjs from "dayjs"

dotenv.config()
const client = new MongoClient(process.env.STREAKS_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const port = process.env.PORT || 3000

async function start() {
    try {
        await client.connect();
        await TeamsDAO.initializeDAO(client);
        app.listen(port, () => {
            console.log(`listening on port ${port}`);
            updateDb();
        });
    } catch (err) {
        console.error(err.stack);
        process.exit(1);
    }
}

start();

async function updateDb() {
    retreiveGameData();
    setInterval(retreiveGameData, 1000 * 60 * 5);
}

async function retreiveGameData() {
    const startDate = dayjs().subtract(3, 'days').format('YYYY-MM-DD');
    const endDate = dayjs().add(7, 'days').format('YYYY-MM-DD');
    const url = `https://statsapi.mlb.com/api/v1/schedule/games/?sportId=1&startDate=${startDate}&endDate=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`retreiving game data for ${startDate} thru ${endDate}`);
    if (data.dates && data.dates.length > 0) {
        const games = data.dates.flatMap(date => date.games);
        updateGames(games);
    } else {
        console.log("No games found.");
    }
}

async function updateGames(games) {
    try {
        const db = client.db("baseball");
        const teamsCollection = db.collection("teams");
        const gamesCollection = db.collection("games");

        // Prepare game data for storage
        const gameData = games.map(game => ({
            gameId: game.gamePk,
            officialDate: game.officialDate,
            firstPitch: game.gameDate,
            homeTeam: game.teams.home.team.name,
            awayTeam: game.teams.away.team.name,
            status: game.status.detailedState,
            score: game.status.statusCode === "F" ? {
                home: game.teams.home.score,
                away: game.teams.away.score
            } : null,
            winner: game.status.statusCode === "F" ? (game.teams.home.score > game.teams.away.score ? "home" : "away") : null,
        }));

        for (const game of gameData) {
            await gamesCollection.updateOne({
                gameId: game.gameId
            }, {
                $set: game
            }, {
                upsert: true
            });
        }

        console.log(`${gameData.length} games updated in MongoDB.`);
        updateTeamWinStreaks();
    } catch (err) {
        console.error("Error updating MongoDB:", err);
    }
}

async function updateTeamWinStreaks() {
    try {
        const db = client.db("baseball");
        const teamsCollection = db.collection("teams");
        const gamesCollection = db.collection("games");
        const regularSeasonStart = "2023-03-30";
        const teams = await teamsCollection.find().toArray();
        for (const team of teams) {
            const completedGames = await gamesCollection.find({
                $and: [{
                    officialDate: {
                        $gte: regularSeasonStart,
                    },
                }, {
                    $or: [{
                            homeTeam: team.name,
                            status: "Final"
                        },
                        {
                            awayTeam: team.name,
                            status: "Final"
                        },
                    ]
                }]
            }).sort({
                gameId: -1
            }).toArray();

            let winStreak = 0;
            for (const game of completedGames) {
                if (game.winner === (game.homeTeam === team.name ? "home" : "away")) {
                    winStreak++;
                } else {
                    break;
                }
            }

            const currentOrNextGame = await gamesCollection.findOne({
                $or: [{
                        homeTeam: team.name,
                        status: {
                            $in: ["In Progress", "Scheduled"]
                        }
                    },
                    {
                        awayTeam: team.name,
                        status: {
                            $in: ["In Progress", "Scheduled"]
                        }
                    },
                ],
            });

            // Update the team document with the current win streak and current or next game
            await teamsCollection.updateOne({
                _id: team._id
            }, {
                $set: {
                    winStreak: winStreak,
                    currentOrNextGame: currentOrNextGame
                }
            });

            console.log(`${team.abbreviation}: ${completedGames.length}, ${winStreak}, ${currentOrNextGame.firstPitch}`);
        }
    } catch (err) {
        console.error("Error updating MongoDB:", err);
    }
}