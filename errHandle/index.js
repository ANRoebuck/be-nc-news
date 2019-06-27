//error handling functions

// invalid inputs
exports.errHandle400 = (err, req, res, next) => {
    const codes = ['22P02', '23502', '23503'];
    //22P02 => 'invalid text representation'
    //23502 => 'violates non-null constraint'
    //23503 => 'violates foreign key restraint'
    if(codes.includes(err.code)){
        res.status(400).send({message: 'bad request'});
    }
    else next(err);
};


// method not allowed
exports.errHandle405 = (req, res, next) => {
    const errObj = {
        status: 405,
        message: "method not allowed"
      };
      next(errObj);
};


// invalid endpoint
exports.errHandleInvalidEnpoint = (req, res, next) => {
    const errObj = {
      status: 404,
      message: "not found"
    };
    next(errObj);
};


// custom error
exports.errHandleCustom = (err, req, res, next) => {
    res.status(err.status).send({ message: err.message });
};