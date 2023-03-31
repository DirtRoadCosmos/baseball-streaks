import TeamsDAO from "../dao/teamsDAO.js";

export default class TeamsController {
    static async apiGetTeams(req, res, next) {

        let filters = req.query

        const { teamsList, totalNumTeams } = await TeamsDAO.getTeams({
            filters
        })

        res.json(teamsList);
    }
}