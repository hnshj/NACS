'use strict';

//------モジュールスコープ変数s--------
  let fs       = require('fs'),
      express  = require('express'),
      app      = express(),
      http     = require('https').createServer({
        key  : fs.readFileSync('private.key'),
        cert : fs.readFileSync('server.pem')
      }, app ),
      io       = require('socket.io')( http ),
      crypt    = require('./lib/crypt'),
      db       = require('./lib/database'),
      port     = 4001;

//------モジュールスコープ変数e--------

//------ユーティリティメソッドs--------
  io.on("connection", function (socket) {

    // ログイン処理
    socket.on('tryLogin', function (msg) {
      db.findManyDocuments('students', {userId:msg.userId}, function (result) {
        if (result.length != 0) {
          crypt.compare(msg.passWord, result[0].passWord, function (res) {
            //パスワードが一致
            if (res) {
              let token = String(Math.random()).slice(2,12);

              //お手軽なランダム文字列をトークンとして設定し、ログイン状態とする
              db.updateDocument('students', {userId:msg.userId}, {$set:{token:token}}, function (res) {
                io.to(socket.id).emit('loginResult', {result  : true,
                                                      userId  : msg.userId,
                                                      token   : token,
                                                      gakunen : result[0].gakunen,
                                                      cls     : result[0].cls,
                                                      name    : result[0].name}); // 送信者のみに送信
              });

            //パスワードが違う
            } else {
              io.to(socket.id).emit('loginResult', {result: false}); // 送信者のみに送信
            }
          });
        // 該当ユーザがいない
        } else {
          io.to(socket.id).emit('loginResult', {result: false}); // 送信者のみに送信
        }
      });
    });

    // ログアウト処理
    socket.on('tryLogout', function (msg) {
      db.findManyDocuments('students', {userId:msg.userId}, function (result) {
        if (result.length != 0) {
          //トークンを空文字列とし、ログアウト状態とする
          db.updateDocument('students', {userId:msg.userId}, {$set:{token:""}}, function (res) {
            io.to(socket.id).emit('logoutResult', {result: true}); // 送信者のみに送信
          });
        // 該当ユーザがいない
        } else {
          io.to(socket.id).emit('logoutResult', {result: false}); // 送信者のみに送信
        }
      });
    });

    // 課題の取得
    socket.on('readyKadai', function (msg) {
      db.findManyDocuments('students', {userId:msg.AKey.userId}, function (result) {
        // ログイン中のユーザにのみ回答
        if (result.length != 0 && msg.AKey.token == result[0].token ) {
          db.findManyDocuments('kadai',
                                msg.SKey,
                                function (res) {

            io.to(socket.id).emit('readyKadaiResult', res); // 送信者のみに送信
          });
        } else {
          io.to(socket.id).emit('readyKadaiResult', []); // 送信者のみに送信
        }
      });
    });

    // 課題の登録
    socket.on('putKadai', function (msg) {
      db.findManyDocuments('students', {userId:msg.AKey.userId}, function (result) {
        // ログイン中のユーザにのみ回答
        if (result.length != 0 && msg.AKey.token == result[0].token ) {
          if ( msg.kadaiId == "" ) {
            db.insertDocument('kadai',
                              msg.kadaiData,
                              function (res) {

              console.log('putKadai insert');
              io.to(socket.id).emit('putKadaiResult', {result: true}); // 送信者のみに送信
            });
          } else {
            db.updateDocument('kadai',
                              { _id : 'ObjectId("' + msg.kadaiId + '")' },
                              {$set:msg.kadaiData},
                              function (res) {

              console.log('putKadai upsert' + msg.kadaiId);
              io.to(socket.id).emit('putKadaiResult', {result: true}); // 送信者のみに送信
            });
          }
        } else {
          io.to(socket.id).emit('putKadaiResult', {result: false}); // 送信者のみに送信
        }
      });
    });

    // 切断
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });

//------ユーティリティメソッドe--------

//------サーバ構成s--------
  app.use( express.json() );
  app.use( express.static( __dirname + '/public' ) );
  app.get('/', function ( request, response ) {
    response.sendFile( __dirname +'/public/kadai.html' );
  });

//------サーバ構成e--------
//------サーバ起動s--------
  http.listen( port, function () {
    console.log(
      'express server listening on port %d in %s mode',
      port, app.settings.env)
  });
//------サーバ起動e--------
