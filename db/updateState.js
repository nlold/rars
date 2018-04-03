const connection = require('./conn');
  
function updateState(ID, object) {
  return connection().then(db => {
    return db.collection('users').update({ chatID: ID }, object, { upsert: true });
  })
};

module.exports = updateState;