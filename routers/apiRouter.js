const express = require("express");
const apiRouter = express.Router();
const { articlesRouter } = require('./articlesRouter');
const { commentsRouter } = require('./commentsRouter');
const { topicsRouter } = require('./topicsRouter');
const { usersRouter } = require('./usersRouter');
const endPoints = require('../endpoints.json');
// const { sendEndPoints } = require('../models');
const { errHandle405 } = require('../errHandle');



apiRouter.route('/')
    .get((req, res, next) => res.send(endPoints))
    .all(errHandle405)



apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);








module.exports = { apiRouter };