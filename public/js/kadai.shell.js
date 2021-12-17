/*
 * kadai.shell.js
 * シェルモジュール
 */
kadai.shell = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
    anchor_schema_map : {
      status : {matiuke         : true, //従属変数なし
                login           : true, //従属変数なし
                calendar        : true
              },
      _status : {
        year  : true,                  // status : calendarのとき使用
        month : true,                  // status : calendarのとき使用
        day   : true,                  // status : calendarのとき使用
      }
      // アンカーマップとして許容される型を事前に指定するためのもの。
      // 例えば、color : {red : true, blue : true}
      // とすれば、キーcolorの値は'red'か'blue'のみ許容される。
      // 単にtrueとすれば、どんな値も許容される。従属キーに対しても同じ。
      // ここでキーとして挙げていないものをキーとして使用するのは許容されない。
    },
    main_html : String()
      + '<div class="kadai-shell-head">'
        + '<div class="kadai-shell-head-title"></div>'
        + '<button class="kadai-shell-head-acct"></button>'
      + '</div>'
      + '<div class="kadai-shell-main">'
      + '</div>',
    titleStr : String()
      + 'hamamatsu nittai kadai kanri'
    },
    stateMap = {
      $container : null,
      anchor_map : {},
    },
    jqueryMap = {},
    copyAnchorMap, changeAnchorPart, onHashchange,
    setJqueryMap, initModule, stateCtl, resetDate;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container : $container,
      $title     : $container.find( '.kadai-shell-head-title' ),
      $acct      : $container.find( '.kadai-shell-head-acct' ),
      $main      : $container.find( '.kadai-shell-main' )
    };
  }

  //---イベントハンドラ---
  onHashchange = function ( event ) {
    let anchor_map_previous = copyAnchorMap(),
        anchor_map_proposed,
        _s_status_previous, _s_status_proposed;

    // アンカーの解析を試みる
    try {
      anchor_map_proposed = $.uriAnchor.makeAnchorMap();
    } catch ( error ) {
      $.uriAnchor.setAnchor( anchor_map_previous, null, true );
      return false;
    }
    stateMap.anchor_map = anchor_map_proposed;

    // makeAnchorMapは独立したキー毎に、'_s_キー'というのを作る。
    // 該当するキー値と、そのキーに従属したキー値が含まれる。
    // おそらくここの処理のように、変更の有無を調べやすくするためのもの。
    // spaの本には単に便利な変数と書いてあった。
    _s_status_previous = anchor_map_previous._s_status;
    _s_status_proposed = anchor_map_proposed._s_status;

    // 変更されている場合の処理
    if ( !anchor_map_previous || _s_status_previous !== _s_status_proposed ) {

      stateCtl(anchor_map_proposed);
    }

    return false;
  }

  // 真のイベントハンドラ
  // 状態管理 URLの変更を感知して各種処理を行う。
  // 履歴に残る操作は必ずここを通る。
  // なお、従属変数は'_s_キー'に入っている。
  stateCtl = function ( anchor_map ) {

    // ログインの場合
    if ( anchor_map.status == 'login' ) {
      kadai.login.configModule({});
      kadai.login.initModule( jqueryMap.$main );

    // カレンダー表示の場合
    } else if ( anchor_map.status == 'calendar' ) {
      kadai.calendar.configModule({});
      kadai.calendar.initModule( jqueryMap.$main );
    }
  }

  //---ユーティリティメソッド---
  copyAnchorMap = function () {
    // $.extendはマージ。第2引数へ第3引数をマージする。
    // 第1引数のtrueはディープコピーを意味する。
    return $.extend( true, {}, stateMap.anchor_map );
  }

  // それ以前の履歴が残らないようにするには replace_flag を true にする。
  // option_map は null でよい。
  // 通常の使用では arg_map のみ渡せばよい。
  changeAnchorPart = function ( arg_map, option_map = null, replace_flag = false ) {
    let anchor_map_revise = copyAnchorMap(),
        bool_return = true,
        key_name, key_name_dep;

    // アンカーマップへ変更を統合
    KEYVAL:
    for ( key_name in arg_map ) {
      if ( arg_map.hasOwnProperty( key_name ) ) {
        // 反復中に従属キーを飛ばす
        if ( key_name.indexOf( '_' ) === 0 ) { continue KEYVAL; }

        // 独立キーを更新する
        anchor_map_revise[key_name] = arg_map[key_name];

        // 合致する独立キーを更新する
        key_name_dep = '_' + key_name;
        if ( arg_map[key_name_dep] ) {
          anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
        } else {
          delete anchor_map_revise[key_name_dep];
          delete anchor_map_revise['_s' + key_name_dep];
        }
      }
    }

    //uriの更新開始。成功しなければ元に戻す
    try {
      $.uriAnchor.setAnchor( anchor_map_revise, option_map, replace_flag );
    } catch {
      // uriを既存の状態に置き換える
      $.uriAnchor.setAnchor( stateMap.anchor_map, null, true );
      bool_return = false;
    }

    return bool_return;
  }

  //---パブリックメソッド---
  initModule = function ( $container ) {

    stateMap.$container = $container; //ここで渡されるのはkadai全体
    $container.html( configMap.main_html );
    setJqueryMap();

    // 許容されるuriアンカーの型を指定
    $.uriAnchor.configModule ({
      schema_map : configMap.anchor_schema_map
    });

    // 以降、各種イベント処理の登録
    // ログインダイアログ表示
    $.gevent.subscribe( $container, 'tryLogin', function (event, msg_map) {
      changeAnchorPart({
        status : 'login'
      });
    });

    // ログイン成功
    $.gevent.subscribe( $container, 'loginSuccess', function (event, msg_map) {

      kadai.acct.configModule({showStr : msg_map.name});
      kadai.acct.initModule( jqueryMap.$acct );

      changeAnchorPart({
        status : 'calendar',
        _status : {
          year  : 21,
          month : 12,
          day   : 17
        }
      }, null, true); //ログイン前には戻したくないので、履歴を消去
    });

/*
    // ログイン失敗
    $.gevent.subscribe( $container, 'loginFailure', function (event, msg_map) {
      //履歴には残さず、しれっとダイヤログを書き直してやり直しさせる。
      skt.dialog.removeDialog();
      skt.dialog.configModule({});
      skt.dialog.initModule( jqueryMap.$container );
    });

    // ログアウトダイアログ表示
    $.gevent.subscribe( $container, 'tryLogout', function (event, msg_map) {
      changeAnchorPart({
        status : 'dialog',
        _status : {
          dialogKind : 'logout'
        }
      });
    });

    // ログアウト成功
    $.gevent.subscribe( $container, 'logoutSuccess', function (event, msg_map) {
      // 設計上、これらはonHashchangeで処理すべきだが、そのためには
      // なぜダイアログを閉じたのかという情報が必要になり面倒。いい案を考える。
      skt.acct.configModule({showStr : "ログインする"});
      skt.acct.initModule( jqueryMap.$acct );

    changeAnchorPart({
      status : 'matiuke'
      }, null, true); //ログイン前には戻したくないので、履歴を消去
    });

    // ログアウト失敗
    $.gevent.subscribe( $container, 'logoutFailure', function (event, msg_map) {
      //どうする？
    });

    // メニュー1(出席連絡(事務))選択など
    $.gevent.subscribe( $container, 'readyAllClassComplete', function (event, msg_map) {

      if ( msg_map.clientState == 'jimu' ) {
        changeAnchorPart({
           status : 'jimurenraku'
        });
      } else if ( msg_map.clientState == 'schoolTotal' ) {
        let today = new Date();

        stateMap.skYear = today.getFullYear();
        stateMap.skMonth = today.getMonth() + 1; //月だけ0始まり
        stateMap.skDay = today.getDate();

        skt.model.readyTodayAll( msg_map.clientState ); // 準備はまだ終わらない
                                   // readyTodayAll  が終わると　readySyukketsuResult
                                   // がくる。
      } else if ( msg_map.clientState == 'proxy' ) {
        changeAnchorPart({
          status : 'proxy'
        });
      }
    });
*/
    kadai.acct.configModule({showStr : 'ログインする'});
    kadai.acct.initModule( jqueryMap.$acct );

    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );
  }

  return { initModule : initModule };
}());
