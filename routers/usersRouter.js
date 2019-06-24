const express = require("express");
const usersRouter = express.Router();





usersRouter
    .route('/:username/')
    .get(sendUserById)
    .all(errHandle405)
    







module.exports = { usersRouter };