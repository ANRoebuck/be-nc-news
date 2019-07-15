const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");
const { errHandleCustom, errHandleInvalidEnpoint, errHandle400 } = require('./errHandle');
const cors = require('cors');


app.use(express.json());
app.use(cors());


app.use('/api', apiRouter);

app.use('/*', errHandleInvalidEnpoint);
app.use(errHandle400);
app.use(errHandleCustom);



module.exports = { app };