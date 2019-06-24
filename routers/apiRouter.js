const express = require("express");
const apiRouter = express.Router();
const { articlesRouter } = require('./articlesRouter');
const { commentsRouter } = require('./commentsRouter');
const { topicsRouter } = require('./topicsRouter');
const { usersRouter } = require('./usersRouter');


apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);

apiRouter.get('/', sendEndpoints);


// app.use(errHandle400);

// app.use("/*", (req, res, next) => {
//   const errObj = {
//     status: 404,
//     msg: "Bad Request"
//   };
//   next(errObj);
// });

// app.use(errHandleCustom);


module.exports = { apiRouter };