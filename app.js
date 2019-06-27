const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { errHandleCustom, errHandleInvalidEnpoint, errHandle400 } = require('./errHandle');


app.use(express.json());


app.use('/api', apiRouter);



app.use('/*', errHandleInvalidEnpoint);
app.use(errHandle400);
app.use(errHandleCustom);



module.exports = { app };