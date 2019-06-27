const {
    getUserById,
} = require('../models');


exports.sendUserById = (req, res, next) => {
    const { username } = req.params;
    getUserById(username)
        .then(user => {
            res.status(200).send({ user });
        })
        .catch(next);
};