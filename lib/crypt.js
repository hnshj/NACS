'use strict';

//------モジュールスコープ変数s--------
  let hash, compare,
      bcrypt = require('bcrypt'),
      saltRounds = 8; //意味は2^saltRounds回処理する。手元のPCでざっと測ったところ、4で10ms,10で75ms

//------モジュールスコープ変数e--------

//------ユーティリティメソッドs--------


//------ユーティリティメソッドe--------


//------パブリックメソッドs--------
  hash = function (myPlaintextPassword, callback) {
    bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hashstr) {
      //errをなんとかしなきゃいけないけど、とりあえず無視。
      //ハッシュ値しか返してないから引数の個数に注意
      callback(hashstr);
    });
  };

  compare = function (myPlaintextPassword, hashstr, callback) {
    // res は true or false
    // true  : myPlaintextPassword のハッシュが hashstr と一致
    // false : myPlaintextPassword のハッシュが hashstr と一致しない
    bcrypt.compare(myPlaintextPassword, hashstr, function(err, res) {
      //hashの関数に同じ
      callback(res);
    });
  };

  module.exports = {
    hash      : hash,
    compare   : compare
  };
//------パブリックメソッドe--------

//------モジュールの初期化s--------

//------モジュールの初期化e--------
