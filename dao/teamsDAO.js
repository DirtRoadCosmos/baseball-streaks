let teams

export default class TeamsDAO {
    static async initializeDAO(conn) {
        if (teams) {
            return
        }
        try {
            teams = await conn.db(process.env.STREAKS_NS).collection("teams")
        } catch (err) {
            console.error(`unable to establish connection: ${err}`)
        }
    }

    static async getTeams({
        filters = null,
    } = {}) {

        // build the query
        let query
        if (filters) {
            if ("name" in filters) {
                query = {$text: {$search: filters["name"]}}
            } else if ("abbreviation" in filters) {
                query = {"abbreviation": {$eq: filters["abbreviation"]}}
            } else if ("league" in filters) {
                query = {"league": {$eq: filters["league"]}}
            }
        }

        // run the query
        let cursor
        try {
            cursor = await teams.find(query);
            const teamsList = await cursor.toArray()
            const totalNumTeams = await teams.countDocuments(query)
            return { teamsList, totalNumTeams }
        } catch (err) {
            console.error(`unable to issue find command: ${err}`)
            return {teamsList: [], totalNumTeams: 0}
        }

    }
}