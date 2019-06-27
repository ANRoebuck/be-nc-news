const { connection } = require('../connection');

exports.getTopics = () => {
    return connection
        .select('*')
        .from('topics')
};