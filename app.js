const express = require("express");
const app = express();
const { apiRouter } = require("./routers/apiRouter");


app.use(express.json());

app.use('/api', apiRouter);






// app.use(errHandle400);

// app.use("/*", (req, res, next) => {
//   const errObj = {
//     status: 404,
//     msg: "Bad Request"
//   };
//   next(errObj);
// });

// app.use(errHandleCustom);




module.exports = { app };