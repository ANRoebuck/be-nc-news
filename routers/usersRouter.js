const express = require("express");
const usersRouter = express.Router();
const { errHandle405 } = require('../errHandle');




usersRouter
    .route('/:username/')
    .get(sendUserById)
    .all(errHandle405)
    







module.exports = { usersRouter };