const express = require("express");
const usersRouter = express.Router();
const { sendUserById } = require('../controllers');
const { errHandle405 } = require('../errHandle');



usersRouter
    .route('/:username/')
    .get(sendUserById)
    
    







module.exports = { usersRouter };