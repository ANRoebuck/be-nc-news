const express = require("express");
const commentsRouter = express.Router();
const { updateComment,
removeComment } = require('../controllers');
const { errHandle405 } = require('../errHandle')




commentsRouter.route('/:comment_id')
    .patch(updateComment)
    .delete(removeComment)
    .all(errHandle405);






module.exports = { commentsRouter };