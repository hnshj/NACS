/*
 *kadai.memo.js
 *メモ表示モジュール
 */
  //---読み込み---
  //load();

kadai.settings = (function (){
    'user strict';

    //---モジュールスコープ変数---
    let configMap = {
        main_html : String()
        + '<h1>色の設定</h1>'
        + '<p class="credit">クレジット</p>'
        + '</div>'
        + '<div class="settings">'
        + '<canvas class="fantasticblue" id="1" width="100" height="100"></canvas>'
        + '<canvas class="calmgreen" id="2" width="100" height="100"></canvas>'
        + '<canvas class="dreamingpurple" id="3" width="100" height="100"></canvas>'
        + '<canvas class="passionategreen" id="4" width="100" height="100"></canvas>'
        + '</div>'
    },

    

    stateMap = {
      $container : null,
    },
    jqueryMap = {},
    setJqueryMap, configModule, initModule, onCalendar, onSchedule;

     //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container
    };
  }


  //---イベントハンドラ---

  

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
    
  //着色
      //1
      const board1 = document.querySelector("#1");
      const ctx1 = board1.getContext("2d");
    
      // 塗りつぶす
      ctx1.fillStyle = "Orange";        // 塗りつぶす色
      ctx1.fillRect(25, 25, 50, 50);    // 描画
      
      //2
      const board2 = document.querySelector("#2");
      const ctx2 = board2.getContext("2d");
      
      // 塗りつぶす
      ctx2.fillStyle = "Orange";        // 塗りつぶす色
      ctx2.fillRect(25, 25, 50, 50);    // 描画
    
      //3
      const board3 = document.querySelector("#3");
      const ctx3 = board3.getContext("2d");
    
      // 塗りつぶす
      ctx3.fillStyle = "Orange";        // 塗りつぶす色
      ctx3.fillRect(25, 25, 50, 50);    // 描画

      //4
      const board4 = document.querySelector("#4");
      const ctx4 = board3.getContext("2d");
    
      // 塗りつぶす
      ctx4.fillStyle = "Orange";        // 塗りつぶす色
      ctx4.fillRect(25, 25, 50, 50);    // 描画

      


return {
  configModule  : configModule,
  initModule    : initModule
};

}());