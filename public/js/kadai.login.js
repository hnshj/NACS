/*
 * kadai.login.js
 * ログイン画面モジュール
 */

//ブラウザが対応しているかどうか
var userAgent = window.navigator.userAgent.toLowerCase();
var caution = [];
if(userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1) {
   window.alert("InternetExplorerは推奨環境ではありません。\n\rプログラムが正常に機能しない可能性があります。");
} else if(userAgent.indexOf('edge') != -1) {
    caution = "ご利用中のブラウザ、MicrosoFtEdgeは推奨環境ではありません。";
} else if(userAgent.indexOf('chrome') != -1) {
    //caution = "ご利用中のブラウザ、GoogleChromeは推奨環境ではありません。";
} else if(userAgent.indexOf('safari') != -1) {
} else if(userAgent.indexOf('firefox') != -1) {
    window.alert("FireFoxは推奨環境ではありません。\n\rプログラムが正常に機能しない可能性があります。");
} else if(userAgent.indexOf('opera') != -1) {
    window.alert("Operaは推奨環境ではありません。\n\rプログラムが正常に機能しない可能性があります。");
} else {
    window.alert("ご使用のブラウザは推奨環境ではありません。\n\rプログラムが正常に機能しない可能性があります。");
}

//名言
var random = Math.floor( Math.random() * 11 );
var meigen = "What's up?"

if (random == 0){
    meigen = "If today were the last day of my life, would I want to do what I am about to do today?";
} else if (random == 1){
    meigen = "I'm a very big believer in equal opportunity as opposed to equal outcome.";
} else if (random == 2){
    meigen = "It's only by saying no that you can concentrate on the things that are really important.";
} else if(random == 3){
  meigen = "Intel入ってる";
} else {
    meigen = "Stay hungry, Stay foolish.";
}

console.log(random);
console.log(meigen);


kadai.login = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<div class="kadai-login-username-title">'
            + '<p>ユーザID</p>'
          + '</div>'
          + '<input type="text" class="kadai-login-username-textbox" class="id" value="hoge">'
          + '<div class="kadai-login-passward-title">'
            + '<p>パスワード</p>'
          + '</div>'
          + '<input type="password" class="kadai-login-passward-textbox" class="pass" value="hogehoge">'
          + '<button class="kadai-login-button-ok">'
            + '<p>ログイン</p>'
          + '</button>'
          + '<button class="kadai-login-button-cancel">'
            + '<p>キャンセル</p>'
          + '</button>'
          +'<div class="copyright" onclick="hp()">'
          +'<p>Copyright © 2022 NACS All Rights Reserved.</p>'
          +'</div>'
          +'<div class="caution" align="center">'
          + caution
          +'</div>'
          +'<div class="alarm">'
         // +alarm
          +'</div>'
          //名言
          +'<div class="other" align="center">'
          +'<b>'
          //+'<span id="meigen">'
          //+'</span>'
          + meigen
          +'</b>'
          +'</div>',
        settable_map : {}
      },
      stateMap = {
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, removeLogin,
      onOK, onCancel;

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
    $.gevent.publish('loginCancel', [{}]);
    return false;
  }

  /*
  document.addEventListener('keypress', keypress_ivent);
function keypress_ivent(e) {
  console.log("Enter");
	 kadai.model.login({userId:jqueryMap.$usernameTextbox.val(),
    passWord:jqueryMap.$PasswordTextbox.val()});
	return false; 
}
*/

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

  removeLogin = function ( ) {
    //初期化と状態の解除
    if ( jqueryMap != null ) {
      if ( jqueryMap.$container ) {
        jqueryMap.$usernameTitle.remove();
        jqueryMap.$usernameTextbox.remove();
        jqueryMap.$PasswordTitle.remove();
        jqueryMap.$PasswordTextbox.remove();
        jqueryMap.$buttonOK.remove();
        jqueryMap.$buttonCancel.remove();
      }
    }
    return true;
  }

  return {
    configModule  : configModule,
    initModule    : initModule,
    removeLogin   : removeLogin
  };
}());
