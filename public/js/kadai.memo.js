/*
 *kadai.memo.js
 *メモ表示モジュール
 */


kadai.memo = (function (){
    'user strict';

    console.log('intel haitteru');

    load()
    //---モジュールスコープ変数---
    let configMap = {
        main_html : String()
        + '<div class="memo">'
        + '<button class="save">保存</button>'
        + '<button class="load">保存されたメモを呼び出す</button>'
        + '<form name="memomodule">'
        + '<textarea name="memo" class="kadai-memo-memo"></textarea>'
        + '</form>'
        + '</div>'
    },
    stateMap = {
      $container : null,
    },
    jqueryMap = {},
    setJqueryMap, configModule, initModule, onCalendar, onSchedule, onSave, onLoad;

     //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
      $calendar    : $container.find( '.kadai-memo-calendar' ),
      $schedule    : $container.find( '.kadai-memo-schedule' ),
      $save        : $container.find( '.save'),
      $load        : $container.find( '.load'), 
    };
  }


  //---イベントハンドラ---
  onSave = function () {
    var result = window.confirm('保存すると、前回保存したものに上書きされます\n保存してもよろしいですか？');
    
    if( result ) {
        var MemoData = document.memomodule.memo.value;
        localStorage.setItem('MemoData', MemoData);
    }
    else {

    }
  }

  onLoad = function () {
    var MemoData = "";
                    if(!localStorage.getItem('MemoData')) {
                        MemoData = "メモは登録されていません。";
                    } else {
                        MemoData = localStorage.getItem('MemoData');
                    }
                    document.memomodule.memo.value = MemoData;
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
    jqueryMap.$save
     .click( onSave );
    jqueryMap.$load
     .click( onLoad );
    return true;
  }
    


return {
  configModule  : configModule,
  initModule    : initModule
};

}());