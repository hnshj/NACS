/*
 * kadai.login.js
 * ログイン画面モジュール
 */
kadai.login = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<div class="kadai-login-username-title">'
            + '<p>ユーザID</p>'
          + '</div>'
          + '<input type="text" class="kadai-login-username-textbox">'
          + '<div class="kadai-login-passward-title">'
            + '<p>password</p>'
          + '</div>'
          + '<input type="password" class="kadai-login-passward-textbox">'
          + '<button class="kadai-login-button-ok">'
            + '<p>ok</p>'
          + '</button>'
          + '<button class="kadai-login-button-cancel">'
            + '<p>cancel</p>'
          + '</button>',
        settable_map : {}
      },
      stateMap = {
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, onOK, onCancel;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
      $usernameTitle   : $container.find( '.kadai-login-username-title' ),
      $usernameTextbox : $container.find( '.kadai-login-username-textbox' ),
      $PasswordTitle   : $container.find( '.kadai-login-passward-title' ),
      $PasswordTextbox : $container.find( '.kadai-login-passward-textbox' ),
      $buttonOK        : $container.find( '.kadai-login-button-ok' ),
      $buttonCancel    : $container.find( '.kadai-login-button-cancel' )
    };
  }

  //---イベントハンドラ---
  onOK = function () {
    kadai.model.login({userId:jqueryMap.$usernameTextbox.val(),
                     passWord:jqueryMap.$PasswordTextbox.val()});
    return false;
  }

  onCancel = function () {
    $.gevent.publish('onCancel', [{}]);
    return false;
  }
  //---ユーティリティメソッド---

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
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$buttonOK
      .click( onOK );
    jqueryMap.$buttonCancel
      .click( onCancel );

    return true;
  }

  return {
    configModule  : configModule,
    initModule    : initModule
  };
}());
