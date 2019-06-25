//error handling functions

exports.errHandle400 = (err, req, res, next) => {
    console.log(err, 'errhandle400')
    const codes = ['22P02', '23502', '23503'];
    //23502 => 'violates non-null constraint'
    //23503 => 'violates foreign key restraint'
    if(codes.includes(err.code)){
        console.log(`custom error for psql error ${err.code}`)
        res.status(400).send({message: 'bad request'});
    }
    else next(err);
};

exports.errHandle405 = function(){};

exports.errHandleCustom = (err, req, res, next) => {
    res.status(err.status).send({ message: err.message });
};

