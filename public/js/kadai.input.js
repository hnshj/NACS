/*
 * kadai.input.js
 * 課題入力モジュール
 */
kadai.input = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<div class="kadai-input-title">'
          + '</div>'
          + '<div class="kadai-input-kyouka-title">'
            + '<p>教科</p>'
          + '</div>'
          + '<input type="text" class="kadai-input-kyouka-textbox">'
          + '<div class="kadai-input-contents-title">'
            + '<p>内容</p>'
          + '</div>'
          + '<input type="text" class="kadai-input-contents-textbox">'
          + '<button class="kadai-input-button-ok">'
            + '<p>ok</p>'
          + '</button>'
          + '<button class="kadai-input-button-cancel">'
            + '<p>cancel</p>'
          + '</button>',
        settable_map : { year  : true,
                         month : true,
                         day   : true},
        year  : 0,
        month : 0,
        day   : 0
      },
      stateMap = {
        $container : null,
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, removeInput,
      onOK, onCancel;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container       : $container,
      $title           : $container.find( '.kadai-input-title' ),
      $kyoukaTitle     : $container.find( '.kadai-input-kyouka-title' ),
      $kyoukaTextbox   : $container.find( '.kadai-input-kyouka-textbox' ),
      $contentsTitle   : $container.find( '.kadai-input-contents-title' ),
      $contentsTextbox : $container.find( '.kadai-input-contents-textbox' ),
      $buttonOK        : $container.find( '.kadai-input-button-ok' ),
      $buttonCancel    : $container.find( '.kadai-input-button-cancel' )
    };
  };

  //---イベントハンドラ---
  onOK = function () {
    kadai.model.putKadai({userId:jqueryMap.$kyoukaTextbox.val(),
                     passWord:jqueryMap.$contentsTextbox.val()});
    return false;
  }

  onCancel = function () {
    $.gevent.publish('inpuCancel', [{ year  : configMap.year,
                                      month : configMap.month,
                                      day   : configMap.day }]);
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

    $container.html( configMap.main_html );
    stateMap.$container = $container;
    setJqueryMap();

    jqueryMap.$title.html(kadai.util.makeDateStr(configMap.year,
                                                 configMap.month - 1, // 月だけ0始まり
                                                 configMap.day)
                          + 'が期限の課題を登録する');

    jqueryMap.$buttonOK
      .click( onOK );
    jqueryMap.$buttonCancel
      .click( onCancel );

    return true;
  }

  removeInput = function ( ) {
    //初期化と状態の解除
    if ( jqueryMap != null ) {
      if ( jqueryMap.$container ) {
        jqueryMap.$title.remove();
        jqueryMap.$kyoukaTitle.remove();
        jqueryMap.$kyoukaTextbox.remove();
        jqueryMap.$contentsTitle.remove();
        jqueryMap.$contentsTextbox.remove();
        jqueryMap.$buttonOK.remove();
        jqueryMap.$buttonCancel.remove();
      }
    }
    return true;
  }

  return {
    configModule : configModule,
    initModule : initModule,
    removeInput: removeInput
  };
}());
