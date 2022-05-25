/*
 *kadai.memo.js
 *メモ表示モジュール
 */
  //---読み込み---
  //load();

kadai.settings = (function (){
    'user strict';

    
    var content = '<p>色の設定</p>'
    + '<div class="blue" style="display: inline-block; _display: inline;">'
    + '<img src="./img/Color/blue.JPG" class="color">'
    + '</div>'
    + '<div class="green" style="display: inline-block; _display: inline;">'
    + '<img src="./img/Color/green.JPG" class="color">'
    + '</div>'
    + '<div class="yellow" style="display: inline-block; _display: inline;">'
    + '<img src="./img/Color/yellow.JPG" class="color">'
    + '</div>'
    + '<div class="purple" style="display: inline-block; _display: inline;">'
    + '<img src="./img/Color/purple.JPG" class="color">';
    

    //content = '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLScOmOYF5pIpyhyf1kq94JeHVtlkq1Qe2PeEzl7tslHOrYFcSg/viewform?embedded=true" width="640" height="601" frameborder="0" marginheight="0" marginwidth="0">読み込んでいます…</iframe>'
    console.log(content);
    //---モジュールスコープ変数---
    let configMap = {
        main_html : String()
        + '<div class="menu">'
        + '<div class="content">'
        + '<p class="theme">テーマ</p>'
        + '<p class="feedback">フィードバック</p>'
        + '<p class="credit">クレジット</p>'
        + '</div>'
        + '<div class="settings">'
        + content
        + '</div>'
        + '</div>'
    },

    

    stateMap = {
      $container : null,
    },
    jqueryMap = {},
    setJqueryMap, configModule, initModule, 
    onTheme, onFeedback, onCredit, onBlue, onGreen, onYellow, onPurple ;

    //設定コンテンツ
var settingstatement = 0;
var content = [];
if (settingstatement == 0){
  content = + '<p>色の設定</p>'
  + '<div class="blue" style="display: inline-block; _display: inline;">'
  + '<img src="./img/Color/blue.JPG" class="color">'
  + '</div>'
  + '<div class="green" style="display: inline-block; _display: inline;">'
  + '<img src="./img/Color/green.JPG" class="color">'
  + '</div>'
  + '<div class="yellow" style="display: inline-block; _display: inline;">'
  + '<img src="./img/Color/yellow.JPG" class="color">'
  + '</div>'
  + '<div class="purple" style="display: inline-block; _display: inline;">'
  + '<img src="./img/Color/purple.JPG" class="color">'
}
     //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
      $theme       : $container.find( '.theme' ),
      $feedback    : $container.find( '.feedback' ),
      $credit      : $container.find( '.credit' ),
      $blue        : $container.find( '.blue' ),
      $green       : $container.find( '.green' ),
      $yellow      : $container.find( '.yellow' ),
      $purple      : $container.find( '.purple' )
    };
  }


  //---イベントハンドラ---
  onTheme = function () {}
  onFeedback = function () {}
  onCredit = function () {}
  onBlue = function () {
    css.innerHTML = '<link rel="stylesheet" href="css/blue/kadai.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.shell.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.login.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.memo.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.calendar.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.schedule.css">'
                   +'<link rel="stylesheet" href="css/blue/kadai.settings.css">';
  }
  onGreen = function() {
    css.innerHTML = '<link rel="stylesheet" href="css/green/kadai.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.shell.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.login.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.memo.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.calendar.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.schedule.css">'
                   +'<link rel="stylesheet" href="css/green/kadai.settings.css">';
  }
  onYellow = function () {
    css.innerHTML = '<link rel="stylesheet" href="css/yellow/kadai.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.shell.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.login.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.memo.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.calendar.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.schedule.css">'
                  +'<link rel="stylesheet" href="css/yellow/kadai.settings.css">';
  }
  onPurple = function () {
    css.innerHTML = '<link rel="stylesheet" href="css/purple/kadai.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.shell.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.login.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.memo.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.calendar.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.schedule.css">'
                   +'<link rel="stylesheet" href="css/purple/kadai.settings.css">';
  }
  

    //---パブリックメソッド---
  configModule = function ( input_map ) {
    kadai.util.setConfigMap({
      input_map : input_map,
      config_map : configMap
    });
    return true;
  }

  initModule = function ( $container ) {
    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();
    return true;
  }
 
  
      
//設定コンテンツ
var settingstatement = 0;
var content = '<p>色の設定</p>'
           + '<canvas class="fantasticblue" id="1" width="100" height="100"></canvas>'
           + '<canvas class="calmgreen" id="2" width="100" height="100"></canvas>'
           + '<canvas class="dreamingpurple" id="3" width="100" height="100"></canvas>'
           + '<canvas class="passionategreen" id="4" width="100" height="100"></canvas>'
           + '<button>フィードバック</button>';
          

content.innerHTML = content;

initModule = function ( $container ) {
  $container.html( configMap.main_html );
  stateMap.$container = $container;
  setJqueryMap();


  // 重複して登録すると、何度もイベントが発行される。それを避けるため、一旦削除
  $(document).off('click');


  jqueryMap.$theme
    .click( onTheme );
  jqueryMap.$feedback
    .click( onFeedback );
  jqueryMap.$credit
    .click( onCredit );
  jqueryMap.$blue
    .click( onBlue );
  jqueryMap.$green
    .click( onGreen );
  jqueryMap.$yellow
    .click( onYellow );
  jqueryMap.$purple
    .click( onPurple );
  return true;
}

console.log(content)
return {
  configModule  : configModule,
  initModule    : initModule
};

}());