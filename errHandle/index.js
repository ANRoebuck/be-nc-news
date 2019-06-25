//error handling functions

exports.errHandle400 = function(){};

exports.errHandle405 = function(){};

exports.errHandleCustom = (err, req, res, next) => {
    res.status(err.status).send({ message: err.message });
};

