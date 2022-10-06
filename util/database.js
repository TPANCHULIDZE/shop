const mongodb = require('mongodb');

let _db;

const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://tato123456:vV0FHpCadatqpRS8@cluster0.ov0wgvy.mongodb.net/?retryWrites=true&w=majority'
  )
  .then(client => {
    console.log('Connected');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
  });
};

const getDb = () => {
  if(_db) {
    return _db;
  }
  throw 'No Database found'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;