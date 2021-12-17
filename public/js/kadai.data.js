/*
 * kadai.data.js
 * データモジュール
 * ソケットの通信はここに集約する。
 * dummyFlgが立っているときは、サーバの模倣して返事をする。
 */

kadai.data = (function () {
  'use strict';

  // 次の2行のうち、どちらかを有効にする。
  const dummyFlg = true;                      // サーバを使わない場合はこちら
//  const dummyFlg = false , socket   = io(); // サーバを使う場合(本番)はこちら

  let dummyRegisterList = [],
      initModule, sendToServer, registerReceive;

  initModule      = function () {};
  sendToServer    = function (eventName, targetObj) {
    if (!dummyFlg) {
      socket.emit(eventName, targetObj);

    // dummy処理
    } else {
      let selectf, evt, obj;

      selectf = function ( eName ) {
        return function ( target ) {
          if ( target.eName == eName ) {
            return true;
          }
        }
      };

      switch ( eventName ) {
        case 'tryLogin':
          evt = dummyRegisterList.find( selectf( 'loginResult' ) );

          if (targetObj.userId == 'suzuki' && targetObj.passWord == 'nittai') {
            obj = { result   : true,
                    userId   : targetObj.userId,
                    token    : 'this is token',
                    userKind : 100,
                    name     : "鈴木" };
          } else {
            obj = { result   : false };
          }

          setTimeout(evt.cb(obj), 200);
          break;

        case 'tryLogout':
          evt = dummyRegisterList.find( selectf( 'logoutResult' ) );
          obj = { result   : true};
          setTimeout(evt.cb(obj), 200);
          break;

        default:
          console.log('something wrong');
        break;
      }
    }
  };

  registerReceive = function (eventName, callback) {
    if (!dummyFlg) {
      socket.on(eventName, callback);

    // dummy処理
    } else {
      dummyRegisterList.push({eName:eventName,cb:callback});
    }
  };

  return { initModule      : initModule,
           sendToServer    : sendToServer,
           registerReceive : registerReceive};
}());
