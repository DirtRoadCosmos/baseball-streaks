import mongodb from "mongodb"
import dotenv from "dotenv"

dotenv.config()
const MongoClient = mongodb.MongoClient

// Connection URL and database name
const url = process.env.RESTREVIEWS_DB_URI;
const dbName = "baseball";


async function insertMlbTeams() {
    const client = new MongoClient(url, {
        useUnifiedTopology: true
    });

    try {
        // Connect to MongoDB
        await client.connect();

        // Get the collection and insert the MLB teams
        const db = client.db(dbName);
        const collection = db.collection("teams");
        const result = await collection.insertMany(mlbTeams);

        console.log(
            `Successfully inserted ${result.insertedCount} MLB teams into the collection.`
        );
    } catch (error) {
        console.error("Error inserting MLB teams:", error);
    } finally {
        // Close the connection to the MongoDB server
        await client.close();
    }
}


// List of MLB teams
const mlbTeams = [{
        name: "New York Yankees",
        abbreviation: "NYY",
        league: "AL",
        division: "East",
        primaryColor: "0C2340",
        secondaryColor: "E4002B",
    },
    {
        name: "Boston Red Sox",
        abbreviation: "BOS",
        league: "AL",
        division: "East",
        primaryColor: "BD3039",
        secondaryColor: "0D2B56",
    },
    {
        name: "Toronto Blue Jays",
        abbreviation: "TOR",
        league: "AL",
        division: "East",
        primaryColor: "134A8E",
        secondaryColor: "E8291C",
    },
    {
        name: "Baltimore Orioles",
        abbreviation: "BAL",
        league: "AL",
        division: "East",
        primaryColor: "DF4601",
        secondaryColor: "000000",
    },
    {
        name: "Tampa Bay Rays",
        abbreviation: "TB",
        league: "AL",
        division: "East",
        primaryColor: "092C5C",
        secondaryColor: "8FBCE6",
    },
    {
        name: "Chicago White Sox",
        abbreviation: "CWS",
        league: "AL",
        division: "Central",
        primaryColor: "27251F",
        secondaryColor: "C4CED4",
    },
    {
        name: "Cleveland Guardians",
        abbreviation: "CLE",
        league: "AL",
        division: "Central",
        primaryColor: "E31937",
        secondaryColor: "26282A",
    },
    {
        name: "Detroit Tigers",
        abbreviation: "DET",
        league: "AL",
        division: "Central",
        primaryColor: "0C2340",
        secondaryColor: "FA4616",
    },
    {
        name: "Kansas City Royals",
        abbreviation: "KC",
        league: "AL",
        division: "Central",
        primaryColor: "004687",
        secondaryColor: "C09A5B",
    },
    {
        name: "Minnesota Twins",
        abbreviation: "MIN",
        league: "AL",
        division: "Central",
        primaryColor: "002B5C",
        secondaryColor: "D31145",
    },
    {
        name: "Houston Astros",
        abbreviation: "HOU",
        league: "AL",
        division: "West",
        primaryColor: "EB6E1F",
        secondaryColor: "002D62",
    },
    {
        name: "Los Angeles Angels",
        abbreviation: "LAA",
        league: "AL",
        division: "West",
        primaryColor: "BA0021",
        secondaryColor: "003263",
    },
    {
        name: "Oakland Athletics",
        abbreviation: "OAK",
        league: "AL",
        division: "West",
        primaryColor: "003831",
        secondaryColor: "EFB21E",
    },
    {
        name: "Seattle Mariners",
        abbreviation: "SEA",
        league: "AL",
        division: "West",
        primaryColor: "0C2C56",
        secondaryColor: "005C5C",
    },
    {
        name: "Texas Rangers",
        abbreviation: "TEX",
        league: "AL",
        division: "West",
        primaryColor: "003278",
        secondaryColor: "C0111F",
    },
    {
        name: "Atlanta Braves",
        abbreviation: "ATL",
        league: "NL",
        division: "East",
        primaryColor: "13274F",
        secondaryColor: "CE1141",
    },
    {
        name: "Miami Marlins",
        abbreviation: "MIA",
        league: "NL",
        division: "East",
        primaryColor: "00A3E0",
        secondaryColor: "EF3340",
    },
    {
        name: "New York Mets",
        abbreviation: "NYM",
        league: "NL",
        division: "East",
        primaryColor: "002D72",
        secondaryColor: "FF5910",
    },
    {
        name: "Philadelphia Phillies",
        abbreviation: "PHI",
        league: "NL",
        division: "East",
        primaryColor: "E81828",
        secondaryColor: "002D72",
    },
    {
        name: "Washington Nationals",
        abbreviation: "WSH",
        league: "NL",
        division: "East",
        primaryColor: "AB0003",
        secondaryColor: "11225B",
    },
    {
        name: "Chicago Cubs",
        abbreviation: "CHC",
        league: "NL",
        division: "Central",
        primaryColor: "0E3386",
        secondaryColor: "CC3433",
    },
    {
        name: "Cincinnati Reds",
        abbreviation: "CIN",
        league: "NL",
        division: "Central",
        primaryColor: "C6011F",
        secondaryColor: "000000",
    },
    {
        name: "Milwaukee Brewers",
        abbreviation: "MIL",
        league: "NL",
        division: "Central",
        primaryColor: "0A2351",
        secondaryColor: "B6922E",
    },
    {
        name: "Pittsburgh Pirates",
        abbreviation: "PIT",
        league: "NL",
        division: "Central",
        primaryColor: "FDB827",
        secondaryColor: "27251F",
    },
    {
        name: "St. Louis Cardinals",
        abbreviation: "STL",
        league: "NL",
        division: "Central",
        primaryColor: "C41E3A",
        secondaryColor: "0C2340",
    },
    {
        name: "Arizona Diamondbacks",
        abbreviation: "ARI",
        league: "NL",
        division: "West",
        primaryColor: "A71930",
        secondaryColor: "E3D4AD",
    },
    {
        name: "Colorado Rockies",
        abbreviation: "COL",
        league: "NL",
        division: "West",
        primaryColor: "33006F",
        secondaryColor: "C4CED4",
    },
    {
        name: "Los Angeles Dodgers",
        abbreviation: "LAD",
        league: "NL",
        division: "West",
        primaryColor: "005A9C",
        secondaryColor: "A5ACAF",
    },
    {
        name: "San Diego Padres",
        abbreviation: "SD",
        league: "NL",
        division: "West",
        primaryColor: "2F241D",
        secondaryColor: "FEC325",
    },
    {
        name: "San Francisco Giants",
        abbreviation: "SF",
        league: "NL",
        division: "West",
        primaryColor: "FD5A1E",
        secondaryColor: "8B6F4E",
    },
];

// insertMlbTeams();