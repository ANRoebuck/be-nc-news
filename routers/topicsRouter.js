const express = require("express");
const topicsRouter = express.Router();
const { sendTopics } = require('../controllers')


topicsRouter.get('/', sendTopics);













module.exports = { topicsRouter };