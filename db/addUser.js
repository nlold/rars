const connection = require('./conn');
  
function addUser(ID) {
  return connection().then(db => {
    return db.collection('users').update({chatID: ID}, {chatID: ID, curEvent: 'start', curQuestion: 0}, { upsert: true });
  })
};

module.exports = addUser;