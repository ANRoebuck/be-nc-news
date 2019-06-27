const {
    getTopics,
} = require('../models');

exports.sendTopics = (req, res, next) => {
    getTopics()
        .then(topics => {
            res.status(200).send({ topics });
        })
        .catch(next);
};