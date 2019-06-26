const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require('../controllers')
const { errHandle405 } = require('../errHandle')





topicsRouter.route('/')
    .get(sendTopics)
    .all(errHandle405)







module.exports = { topicsRouter };