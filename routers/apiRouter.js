const express = require("express");
const apiRouter = express.Router();
const endPoints = require('../endpoints.json');
const { errHandle405 } = require('../errHandle');
const {
    articlesRouter,
    commentsRouter,
    topicsRouter,
    usersRouter
} = require('../routers')




apiRouter.route('/')
    .get((req, res, next) => res.send(endPoints))
    .all(errHandle405)



apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);





module.exports = { apiRouter };