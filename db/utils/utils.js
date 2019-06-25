exports.formatDate = list => {
    return list.map(({created_at, ...args}) => {
        const formattedDate = (new Date(created_at));
        return {
            created_at: formattedDate,
            ...args
        };
    });
};

exports.makeRefObj = (list, key1, key2) => {
    return list.reduce((refObj, ele) => {
        refObj[ele[key1]] = ele[key2];
        return refObj;
    }, {});
};

exports.formatComments = (comments, articleRef) => {
    return comments.map(({belongs_to, created_by, ...args}) => {
        return {
            article_id: articleRef[belongs_to],
            author: created_by,
            ...args
        };
    });
};