const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

let connDB = null;

function connection() {
  if(connDB) return Promise.resolve(connDB);
        
  return mongoClient.connect(url).then(client => { 
    let db = client.db('rars_bot');
    connDB = db;
    return connDB;
  });
}

module.exports = connection;