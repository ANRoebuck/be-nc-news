const express = require("express");
const usersRouter = express.Router();
const { errHandle405 } = require('../errHandle');
const { sendUserById } = require('../controllers');



usersRouter
    .route('/:username/')
    .get(sendUserById)
    
    







module.exports = { usersRouter };