const { connection } = require('../connection');

exports.getUserById = (username) => {
    return connection
        .select('*')
        .from('users')
        .where({ username })
        .then(rows => {
            if(rows.length === 0) return Promise.reject({status: 404, message: `user does not exist: ${username}`});
            else return rows[0];
        });
};