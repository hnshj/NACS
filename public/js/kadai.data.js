/*
 * kadai.data.js
 * データモジュール
 * ソケットの通信はここに集約する。
 * dummyFlgが立っているときは、サーバの模倣して返事をする。
 */

kadai.data = (function () {
  'use strict';

  // 次の2行のうち、どちらかを有効にする。
//  const dummyFlg = true;                      // サーバを使わない場合はこちら
  const dummyFlg = false , socket   = io(); // サーバを使う場合(本番)はこちら

  let initModule, sendToServer, registerReceive,
      dummyRegisterList = [],
      dummyLoginFlg     = false;

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

          if (targetObj.userId == 'suzuki' && targetObj.passWord == 'hogehoge') {
            obj = { result   : true,
                    userId   : targetObj.userId,
                    token    : 'this is token',
                    gakunen  : 1,
                    cls      : 2,
                    name     : "鈴木" };

            dummyLoginFlg = true;
          } else {
            obj = { result   : false };
          }

          setTimeout(evt.cb(obj), 200);
          break;

        case 'tryLogout':
          dummyLoginFlg = false;

          evt = dummyRegisterList.find( selectf( 'logoutResult' ) );
          obj = { result : true };
          setTimeout(evt.cb(obj), 200);
          break;

        case 'islogind':
          if ( dummyLoginFlg == true ) {
            return true;
          } else {
            return true;
          }
          break;

        case 'putKadai':
          evt = dummyRegisterList.find( selectf( 'putKadaiResult' ) );
          obj = { result : true };
          setTimeout(evt.cb(obj), 200);
          break;

        case 'readyKadai':
          evt = dummyRegisterList.find( selectf( 'readyKadaiResult' ) );

          obj = [{ gakunen       : 1,
                   cls           : 2,
                   ownerName     : '鈴木',
                   deadlineYear  : 2021,
                   deadlineMonth : 12,
                   deadlineDay   : 21,
                   kyouka        : '数学',
                   contents      : 'クリアー1A P.200' },
                 { gakunen       : 1,
                   cls           : 2,
                   ownerName     : '田中',
                   deadlineYear  : 2021,
                   deadlineMonth : 12,
                   deadlineDay   : 21,
                   kyouka        : '英語',
                   contents      : 'シス単 P.300' },
                 { gakunen       : 1,
                   cls           : 2,
                   ownerName     : '佐藤',
                   deadlineYear  : 2021,
                   deadlineMonth : 12,
                   deadlineDay   : 25,
                   kyouka        : '物理',
                   contents      : '問題集 P.400' }]

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
