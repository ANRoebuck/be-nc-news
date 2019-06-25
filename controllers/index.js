const {
    getTopics,
} = require('../models');

exports.sendTopics = (req, res, next) => {
    getTopics()
        .then(rows => {
            res.status(200).send({rows});
        })
        .catch(next);
};