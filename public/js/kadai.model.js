/*
 * kadai.model.js
 * モデルモジュール
 */

kadai.model = (function () {
  'use strict';

  let initModule, login, logout, islogind, getAKey, putKadai, readyKadai,
      getKadai, removeKadai, initLocal, //関数
      accessKey, personalInfo, kadaiData;//モジュールスコープ変数

  initLocal = function () {
    accessKey    = {};
    personalInfo = {};
    kadaiData    = [];
  }

  initModule = function () {

    initLocal();

    kadai.data.initModule();

    // 以降様々なイベントの結果を受け取るための登録

    // ログイン処理の結果
    kadai.data.registerReceive('loginResult', function (msg) {
      // ログイン成功
      if ( msg.result == true ) {
        accessKey    = { userId : msg.userId,
                         token  : msg.token };
        personalInfo = { name    : msg.name,
                         gakunen : msg.gakunen,
                         cls     : msg.cls };

        $.gevent.publish('loginSuccess', [{ name: personalInfo.name }]);

      // ログイン失敗
      } else {
        $.gevent.publish('loginFailure', [msg]);
        window.alert("ログインに失敗しました")
      }
    });


    kadai.data.registerReceive('logoutResult', function (msg) {
      let eventName;
      // ログアウト成功
      if ( msg.result == true ) {
        eventName = 'logoutSuccess';

        initLocal();
      // ログアウト失敗
      } else {
        // 失敗したとして、どうする？
        eventName = 'logoutFailure';
      }
      $.gevent.publish(eventName, [msg]);
    });

    // 課題登録完了
    kadai.data.registerReceive('putKadaiResult', function (msg) {
      // もうちょい　いいやり方はあるかもしれないが、とりあえず、
      // 更新したら、読み直す。
      kadai.model.readyKadai();
    });

    // 課題取得完了
    kadai.data.registerReceive('readyKadaiResult', function (msg) {
      kadaiData = msg;
      $.gevent.publish('readyKadaicomplete', [msg]);
    });

    // 課題削除完了
    kadai.data.registerReceive('removeKadaiResult', function (msg) {
      kadai.model.readyKadai();
    });

  };//initModule end


  login = function (queryObj) {
    kadai.data.sendToServer( 'tryLogin', queryObj );
  };

  logout = function () {
    kadai.data.sendToServer( 'tryLogout', accessKey );
  };

  islogind = function () {
    //accessKeyがtokenプロパティを持ち
    if ( Object.keys(accessKey).indexOf('token') !== -1 ) {
      //さらに空でない文字列が設定されていればログイン済
      if ( accessKey.token !== undefined ) {
        if (accessKey.token != "") {
          return true;
        }
      }
    }
    return false;
  };

  getAKey = function () {
    return accessKey;
  };

  putKadai = function (kadaiId, obj) {
    let nowStr = "",
        now = new Date();

    nowStr += now.getFullYear() + ':';
    nowStr += (now.getMonth() + 1 ) + ':', //月だけ0始まり
    nowStr += now.getDate() + ':';
    nowStr += now.getHours() + ':';
    nowStr += now.getMinutes() + ':';
    nowStr += now.getSeconds();

    // 自分の学年,クラスの課題を登録し、登録者がデータの所有者
    let queryObj = { AKey      : accessKey,
                     kadaiId   : kadaiId,
                     kadaiData : { gakunen       : Number(personalInfo.gakunen),
                                   cls           : Number(personalInfo.cls),
                                   owner         : accessKey.userId,
                                   deadlineYear  : Number(obj.deadlineYear),
                                   deadlineMonth : Number(obj.deadlineMonth),
                                   deadlineDay   : Number(obj.deadlineDay),
                                   contents      : [obj.contents],
                                   kyouka        : [obj.kyouka],
                                   putDate       : nowStr }};

    kadai.data.sendToServer( 'putKadai', queryObj );
    return true;
  };

  readyKadai = function () {
    let queryObj = { AKey : accessKey,
                     Skey : { gakunen       : Number(personalInfo.gakunen),
                              cls           : Number(personalInfo.cls) }};

    kadai.data.sendToServer( 'readyKadai', queryObj );
    return true;
  }

  getKadai = function () {
    return kadaiData;
  }

  removeKadai = function ( kadaiId ) {
    let queryObj = { AKey      : accessKey,
                     kadaiId   : kadaiId };

    kadai.data.sendToServer( 'removeKadai', queryObj );
    return true;
  };

  return { initModule      : initModule,
          login            : login,
          logout           : logout,
          islogind         : islogind,
          getAKey          : getAKey,
          putKadai         : putKadai,
          readyKadai       : readyKadai,
          getKadai         : getKadai,
          removeKadai      : removeKadai
        };
}());
