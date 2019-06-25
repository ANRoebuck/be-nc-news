const { connection } = require('../connection');

exports.getTopics = () => {
    return connection
        .select('*')
        .from('topics');
};

exports.getUserById = (username) => {
    return connection
        .select('*')
        .from('users')
        .where({ username })
        .then(rows => {
            if(rows.length === 0){
                return Promise.reject({status: 404, message: 'invalid username'});
            } else {
                return rows[0];
            };
        });
}