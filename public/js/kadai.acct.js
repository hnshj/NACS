/*
 * kadai.acct.js
 * アカウント部モジュール
 */
kadai.acct = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html1 : String()
          + '<div style="padding:0.3em; color:#fff">',
        main_html2 : String()
          + '</div>',
        settable_map : {showStr : true},
        showStr : ""
      },
      stateMap = {
        $container : null,
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, onClick;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container : $container
    };
  };

  //---イベントハンドラ---
  onClick = function () {
    console.log('onClick');
    if ( kadai.model.islogind() == false ) {
      console.log('not login');
      $.gevent.publish('tryLogin', [{}]);
    } else {
      console.log('longind');
      $.gevent.publish('tryLogout', [{}]);
    }

    return false;
  }

  //---パブリックメソッド---
  configModule = function ( input_map ) {
    kadai.util.setConfigMap({
      input_map : input_map,
      settable_map : configMap.settable_map,
      config_map : configMap
    });
    return true;
  }

  initModule = function ( $container ) {

    $container.html( configMap.main_html1 + configMap.showStr + configMap.main_html2 );
    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$container //setJqueryMap　より前に呼ぶとjqueryMapの$containerが設定されておらずエラー
      .click( onClick );

    return true;
  }

  return {
    configModule : configModule,
    initModule : initModule
  };
}());
