const express = require("express");
const topicsRouter = express.Router();



topicsRouter.get('/', sendTopics);













module.exports = { topicsRouter };