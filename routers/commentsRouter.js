const express = require("express");
const commentsRouter = express.Router();




commentsRouter.route('/:comment_id')
    .patch(updateComment)
    .delete(removeComment)
    .all(errHandle405);









module.exports = { commentsRouter };