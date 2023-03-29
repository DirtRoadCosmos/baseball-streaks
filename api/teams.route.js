import express from "express"
import TeamsCtrl from "./teams.controller.js"

const router = express.Router()

router.route("/").get(TeamsCtrl.apiGetTeams)

export default router