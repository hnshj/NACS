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
                calendar        : true,
                memo            : true,
                schedule        : true,
                input           : true,
                settings        : true
              },
      _status : {
        year     : true,                  // status : calendar,inputのとき使用
        month    : true,                  // status : calendar,inputのとき使用
        day      : true,                  // status : calendar,inputのとき使用
        kadaiId  : true,                  // status : inputのとき使用
        kyouka   : true,                  // status : inputのとき使用
        contents : true                   // status : inputのとき使用

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
        + '<div class="kadai-shell-head-function">'
        + '<button class="kadai-shell-head-kadai">課題</button>'
        + '<button class="kadai-shell-head-schedule">時間割</button>'
        + '<button class="kadai-shell-head-memo">メモ</button>'
        + '</div>'
        + '<button class="kadai-shell-head-acct"></button>'
      + '</div>'
      + '<div class="kadai-shell-main">'
      + '</div>',
    titleStr : String()
    + '<strong>NACS</strong>'
    /*
    menuStr  : String()
    + '<div class="kadai-shell-head-menubar">'
    + '<div class="kadai-shell-head-kadai">課題一覧</div>'
    + '<div class="kadai-shell-head-schedule">時間割</div>'
    + '<div class="kadai-shell-head-memo">メモ</div>'
    + '</div>'
    */
    },
    stateMap = {
      $container : null,
      anchor_map : {},
    },
    jqueryMap = {},
    copyAnchorMap, changeAnchorPart, onHashchange, onTitle,
    onCalendar, onSchedule, onMemo,
    setJqueryMap, initModule, stateCtl, resetDate;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container : $container,
      $title     : $container.find( '.kadai-shell-head-title' ),
      $acct      : $container.find( '.kadai-shell-head-acct' ),
      $calendar  : $container.find( '.kadai-shell-head-kadai' ),
      $schedule  : $container.find( '.kadai-shell-head-schedule' ),
      $memo      : $container.find( '.kadai-shell-head-memo' ),
      $main      : $container.find( '.kadai-shell-main' )
    };
  }

  //---イベントハンドラ---
  onTitle = function () {
    $.gevent.publish('settings');
  }

  onCalendar = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
      month : day.getMonth() + 1, //月だけ0始まり
      day   : day.getDate()};
    $.gevent.publish('changeCalendar', [obj]);
  }

  onMemo = function () {
    //memo
    $.gevent.publish('memo');
  }

  onSchedule = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
      month : day.getMonth() + 1, //月だけ0始まり
      day   : day.getDate()};
    $.gevent.publish('schedule', [obj]);
  }



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

    //設定の場合
    } else if ( anchor_map.status == 'settings' ) {
      kadai.settings.initModule( jqueryMap.$main);
      console.log("settings");
    //カレンダー表示の場合
    } else if ( anchor_map.status == 'calendar' ) {
      kadai.calendar.configModule({ year  : anchor_map._status.year,
                                    month : anchor_map._status.month,
                                    day   : anchor_map._status.day });
      kadai.calendar.initModule( jqueryMap.$main );

    // 課題入力の場合
    } else if ( anchor_map.status == 'input' ) {
      kadai.input.configModule({ year     : anchor_map._status.year,
                                 month    : anchor_map._status.month,
                                 day      : anchor_map._status.day,
                                 kadaiId  : anchor_map._status.kadaiId,
                                 kyouka   : anchor_map._status.kyouka,
                                 contents : anchor_map._status.contents });

      kadai.input.initModule( jqueryMap.$main );

    //メモの場合
    }else if( anchor_map.status == 'memo'){
      kadai.memo.initModule( jqueryMap.$main);
    
    //時間割の場合
    }else if( anchor_map.status == 'schedule'){
      /*kadai.schedule.configModule({ year  : anchor_map._status.year,
        month : anchor_map._status.month,
        day   : anchor_map._status.day });*/
      kadai.schedule.initModule( jqueryMap.$main);

    // ログアウトの場合
    } else if ( anchor_map.status == 'matiuke' ) {
      kadai.calendar.removeCalendar();
      kadai.input.removeInput();
      kadai.login.removeLogin();
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
    jqueryMap.$title
     .click( onTitle );
    jqueryMap.$calendar
     .click( onCalendar );
    jqueryMap.$schedule
     .click( onSchedule );
    jqueryMap.$memo
     .click( onMemo );
    // 許容されるuriアンカーの型を指定
    $.uriAnchor.configModule ({
      schema_map : configMap.anchor_schema_map
    });

    // タイトルの設定
    jqueryMap.$title.html( configMap.titleStr );

    //メニューの設定
    //jqueryMap.$menu.html( configMap.menuStr);

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

      // 課題を一発取っておく
      kadai.model.readyKadai();
    });

    // ログイン失敗
    $.gevent.subscribe( $container, 'loginFailure', function (event, msg_map) {
      //履歴には残さず、しれっとダイヤログを書き直してやり直しさせる。
      kadai.login.configModule({});
      kadai.login.initModule( jqueryMap.$main );
    });

    //設定
    $.gevent.subscribe( $container, 'settings', function (event, msg_map) {
      changeAnchorPart({
        status : 'settings',
      });
    });

    // カレンダー日付変更
    $.gevent.subscribe( $container, 'changeCalendar', function (event, msg_map) {
      changeAnchorPart({
        status : 'calendar',
        _status : {
          year  : msg_map.year,
          month : msg_map.month,
          day   : msg_map.day
        }
      });
    });

    // 課題入力
    $.gevent.subscribe( $container, 'inputKadai', function (event, msg_map) {
      changeAnchorPart({
        status : 'input',
        _status : {
          year     : msg_map.year,
          month    : msg_map.month,
          day      : msg_map.day,
          kadaiId  : msg_map.kadaiId,
          contents : msg_map.contents,
          kyouka   : msg_map.kyouka
        }
      });
    });

    //メモ
    $.gevent.subscribe( $container, 'memo', function (event, msg_map) {
      changeAnchorPart({
        status : 'memo',
      });
    });

    //時間割
    $.gevent.subscribe( $container, 'schedule', function (event, msg_map) {
      changeAnchorPart({
        status : 'schedule',
        /*_status : {
          year  : msg_map.year,
          month : msg_map.month,
          day   : msg_map.day
        }*/
      });
    });

    // ログアウト
    $.gevent.subscribe( $container, 'logoutSuccess', function (event, msg_map) {

      kadai.acct.configModule({showStr : 'ログインする'});
      kadai.acct.initModule( jqueryMap.$acct );

      changeAnchorPart({
        status : 'matiuke'
      });
    });

    // ログインキャンセル
    $.gevent.subscribe( $container, 'loginCancel', function (event, msg_map) {
      changeAnchorPart({
        status : 'matiuke'
      });
    });

    // 課題入力キャンセル
    $.gevent.subscribe( $container, 'inpuCancel', function (event, msg_map) {
      changeAnchorPart({
        status : 'calendar',
        _status : {
          year  : msg_map.year,
          month : msg_map.month,
          day   : msg_map.day
        }
      });
    });

    // 課題取得完了
    $.gevent.subscribe( $container, 'readyKadaicomplete', function (event, msg_map) {
      let today = new Date();

      changeAnchorPart({
        status : 'calendar',
        _status : {
          year  : today.getFullYear(),
          month : today.getMonth() + 1, //月だけ0始まり
          day   : today.getDate()
        }
      });
    });

    kadai.acct.configModule({showStr : 'ログインする'});
    kadai.acct.initModule( jqueryMap.$acct );

    $(window)
      .bind( 'hashchange', onHashchange )
      .trigger( 'hashchange' );
  }

  return { initModule : initModule };
}());
