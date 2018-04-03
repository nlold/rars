const connection = require('./conn');

function getInfo(ID) {
    return connection().then(db => {
        return db.collection('users').findOne({ chatID: ID });
    })
};

module.exports = getInfo;