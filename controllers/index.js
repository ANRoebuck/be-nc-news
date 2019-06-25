const {
    getTopics,
    getUserById
} = require('../models');

exports.sendTopics = (req, res, next) => {
    getTopics()
        .then(rows => {
            res.status(200).send({rows});
        })
        .catch(next);
};

exports.sendUserById = (req, res, next) => {
    const { username } = req.params;
    getUserById(username)
        .then(user => {
            res.status(200).send({ user });
        })
        .catch(next);
};