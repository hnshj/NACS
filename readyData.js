'use strict';
// サーバで直接ユーザ登録するためのもの
//
// 注意
// JSON.parse は単一引用符を許容しない
// JSON.parse 中ではコメントが許されないっぽい
//
//------モジュールスコープ変数s--------
  let addStudents,
      fs           = require('fs'),
      crypt        = require('./lib/crypt'),
      db           = require('./lib/database'),
      studentsList = JSON.parse(fs.readFileSync('./data2DB/students.json', 'utf8'));

//------モジュールスコープ変数e--------

//------ユーティリティメソッドs--------
  addStudents = function ( studentsList ) {
    const listnum = studentsList.length;
    let i, complete_num, addStudentsInner;

    //登録完了数を設定
    complete_num = 0;

    //このように一件つづ登録するなら、ハッシュのコールバックの中でユーザIDを使う関係で
    //ユーザIDが関数の引数として存在しなければならない。
    //そのためのaddStudentsInner
    addStudentsInner = function (userIdStr, passWordStr, nameStr, gakunenStr, clsStr ) {
      crypt.hash(passWordStr,function (hashstr) {
        let insertObj = {userId   : userIdStr,
                         passWord : hashstr,
                         token    : "",
                         name     : nameStr,
                         gakunen  : gakunenStr,
                         cls      : clsStr};
        db.insertDocument('students', insertObj, function (result) {
          complete_num++;
          if (complete_num == listnum) {
              console.log('addStudents done');
              process.exit(0);
          }
        });
      });
    };

    for ( i = 0; i < listnum; i++) {
      addStudentsInner(studentsList[i].userId,
                       studentsList[i].passWord,
                       studentsList[i].name,
                       studentsList[i].gakunen,
                       studentsList[i].cls);
    }
  }
//------ユーティリティメソッドe--------

  // 生徒の追加を実行
  // DBの接続を待ってから行う。200msはだいたい。
  setTimeout(function () {
    addStudents( studentsList );
  }, 200);
