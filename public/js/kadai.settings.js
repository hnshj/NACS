/*
 *kadai.memo.js
 *メモ表示モジュール
 */
  //---読み込み---
  //load();

kadai.settings = (function (){
    'user strict';

    console.log('intel haitteru');

    //---モジュールスコープ変数---
    let configMap = {
        main_html : String()
        + '<div class="menu">'
        + '</div>'
        + '<div class="settings">'
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
      $container   : $container,
      $calendar    : $container.find( '.kadai-memo-calendar' ),
      $schedule    : $container.find( '.kadai-memo-schedule' )
    };
  }


  //---イベントハンドラ---
  onCalendar = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
      month : day.getMonth() + 1, //月だけ0始まり
      day   : day.getDate()};
    $.gevent.publish('changeCalendar', [obj]);

    window.alert("calendar");
    save();
  }

  onSchedule = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
      month : day.getMonth() + 1, //月だけ0始まり
      day   : day.getDate()};
    $.gevent.publish('schedule', [obj]);

    window.alert("schedule");
    save();
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
    jqueryMap.$calendar
     .click( onCalendar );
    jqueryMap.$schedule
     .click( onSchedule );
    return true;
  }
    


return {
  configModule  : configModule,
  initModule    : initModule
};

}());