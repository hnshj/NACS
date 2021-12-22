'use strict';

//------モジュールスコープ変数s--------
  let insertDocument, insertManyDocuments,findManyDocuments, updateDocument,
      deleteManyDocuments,
      mongodb  = require('mongodb'),
      mongoClient = mongodb.MongoClient,
      connectOption = {useUnifiedTopology: true},
      dbInConnectionPool; //コネクションはmongoClientが面倒見てくれるはず
                          // 参考 https://teratail.com/questions/296545
//------モジュールスコープ変数e--------

//------ユーティリティメソッドs--------


//------ユーティリティメソッドe--------


//------パブリックメソッドs--------
  insertDocument = function (colName, insertObj, callback) {
    let collection = dbInConnectionPool.collection(colName);

    collection.insertOne(insertObj, function (err, result) {
      callback(result);
    });
  }

  insertManyDocuments = function (colName, insertObj, callback) {
    let collection = dbInConnectionPool.collection(colName);

    collection.insertMany(insertObj, function (err, result) {
      callback(result);
    });
  }

  findManyDocuments = function (colName, queryObj, callback) {
    let collection = dbInConnectionPool.collection(colName);

    // 第一引数に指定する条件の書き方例(ただし、指定するのはクライアントのモデル)
    // 演算子  意味　例
    // $lt     <    { age:{$lt:100} }
    // $lte    <=   { age:{$lte:100} }
    // $gt     >    { age:{$gt:100} }
    // $gte    >=   { age:{$gte:100} }
    // $ne	   !=   { name:{$ne:'mr.a'} }
    // $exists      db.mycol.find({ hoge:{$exists:false} })
    // $or     or   db.mycol.find({$or:[{loves:'apple'},{loves:'energon'}]})
    // また、
    // mongoDBが自動的に付加するIDの_idで検索するには
    // ObjectId = require('mongodb').ObjectID
    // して得られるこれで、ObjectId(ID文字列)を指定する

    collection.find(queryObj).toArray(function (err, result) {
      callback(result);
    });
  }

  updateDocument = function (colName, queryObj, updateObj, callback) {
    let collection = dbInConnectionPool.collection(colName);
    collection.updateOne(queryObj, updateObj, function (err, result) {
      callback(result);
    });
  }

  deleteManyDocuments = function (colName, queryObj, callback) {
    let collection = dbInConnectionPool.collection(colName);

    collection.deleteMany(queryObj, function (err, result) {
      callback(result);
    });
  }


  module.exports = {
    insertDocument      : insertDocument,
    insertManyDocuments : insertManyDocuments,
    findManyDocuments   : findManyDocuments,
    updateDocument      : updateDocument,
    deleteManyDocuments : deleteManyDocuments
  };
//------パブリックメソッドe--------

//------モジュールの初期化s--------
// 予めDB接続をプールしておいて、アクセス時にはそこから使う。
  mongoClient.connect('mongodb://testuser1:hogehoge@localhost:27018/myproject', connectOption, function (err, client) {
    dbInConnectionPool = client.db('myproject');
    console.log('db connection success');
  });
//------モジュールの初期化e--------
