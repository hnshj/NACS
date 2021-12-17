/*
 * kadai.model.js
 * モデルモジュール
 */

kadai.model = (function () {
  'use strict';

  let initModule, login, logout, islogind, getAKey, putKadai, getKadai,
      initLocal, //関数
      accessKey, userKind, name;//モジュールスコープ変数

  initLocal = function () {
    accessKey   = {};
    userKind    = 0;
    name        = "";
  }

  initModule = function () {

    initLocal();

    kadai.data.initModule();

    // 以降様々なイベントの結果を受け取るための登録

    // ログイン処理の結果
    kadai.data.registerReceive('loginResult', function (msg) {
      let eventName;
      // ログイン成功
      if ( msg.result == true ) {
        accessKey = { userId : msg.userId,
                      token  : msg.token};
        userKind  = msg.userKind;
        name      = msg.name;

        // ログイン時にみんな行うカレンダー取得
        $.gevent.publish('loginSuccess', [{ name: name }]);

      // ログイン失敗
      } else {
        $.gevent.publish('loginFailure', [msg]);
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

    // 日課登録完了
    kadai.data.registerReceive('updateCalendarResult', function (msg) {
      // もうちょい　いいやり方はあるかもしれないが、とりあえず、
      // 更新したら、読み直す。
      kadai.model.readyCalendar();
    });

  };//initModule end


  login = function (queryObj) {
    kadai.data.sendToServer('tryLogin',queryObj);
  };

  logout = function () {
    kadai.data.sendToServer('tryLogout',{userId : accessKey.userId,
                                       token  : accessKey.token});
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

  return { initModule      : initModule,
          login            : login,
          logout           : logout,
          islogind         : islogind,
          getAKey          : getAKey,
          putKadai         : putKadai,
          getKadai         : getKadai
        };
}());
