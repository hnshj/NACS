/*
 * kadai.calendar.js
 * カレンダー表示モジュール
 */
kadai.calendar = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<button class="kadai-calendar-previousWeek">前の週</button>'
          + '<button class="kadai-calendar-back">今週へ戻る</button>'
          + '<button class="kadai-calendar-nextWeek">次の週</button>'
          + '<table class="kadai-calendar-main"></table>',
        tHeader : String()
          + '<tr><td>曜日</td>'
          + '<td>日</td>'
          + '<td>月</td>'
          + '<td>火</td>'
          + '<td>水</td>'
          + '<td>木</td>'
          + '<td>金</td>'
          + '<td>土</td></tr>',
        tContentClassName : String()
          + 'kadai-calendar-edit',
        settable_map : { year  : true,
                         month : true,
                         day   : true},
        year  : 0,
        month : 0,
        day   : 0
      },
      stateMap = {
        $container : null,
        kd         : []
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, removeCalendar,
      onPrevious, onBack, onNext, createTable;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
      $hohoge: $container.find( '.hohoge' ),
      $previousWeek: $container.find( '.kadai-calendar-previousWeek' ),
      $back        : $container.find( '.kadai-calendar-back' ),
      $nextWeek    : $container.find( '.kadai-calendar-nextWeek' ),
      $main        : $container.find( '.kadai-calendar-main' )
    };
  }

  //---イベントハンドラ---
  onPrevious = function () {
    let day = new Date(configMap.year, configMap.month - 1, configMap.day), obj;

    day.setDate(day.getDate() - (1*7));

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('changeCalendar', [obj]);
  }

  onBack = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('changeCalendar', [obj]);
  }

  onNext = function () {
    let day = new Date(configMap.year, configMap.month - 1, configMap.day), obj;

    day.setDate(day.getDate() + (1*7));

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('changeCalendar', [obj]);
  }

  //---ユーティリティメソッド---
  createTable = function () {

    let i, j, str, weeks, kdOneDay,
        //年月日を指定して該当の日の分を引き当てる
        selectfunc = function ( year, month, day ) {
          return function ( target ) {
            if (target.deadlineYear == year && target.deadlineMonth == month && target.deadlineDay == day) {
              return true;
            }
          };
        };

    jqueryMap.$main.append(configMap.tHeader);

    for (j = 0; j < 1; j++) {
      weeks = kadai.util.getWeek(configMap.year,
                               configMap.month-1, //月だけ0始まり
                               configMap.day,
                               j);
      // 曜日あたり1行目：日付
      str = '<tr>';
      for (i = 0; i < 8; i++) {
        if (i == 0) {
          str += '<td>日付</td>';
        } else {
          str += '<td>';
          //-1は最初の一つが「日付」でずれるから
          str += String(weeks[i-1].month) + '/' + String(weeks[i-1].day);
          str += '</td>';
        }
      }
      str += '</tr>';
      // 曜日あたり2行目：課題
      str += '<tr>';
      for (i = 0; i < 8; i++) {
        if (i == 0) {
          str += '<td>課題</td>';
        } else {
          // ここで課題をいれる

          //-1は最初の一つが「課題」でずれるから
          kdOneDay = stateMap.kd.filter(selectfunc(weeks[i-1].year, weeks[i-1].month, weeks[i-1].day));
          if ( kdOneDay.length == 0 ) {
            str += '<td class="' + configMap.tContentClassName + '"></td>';


          } else {
            let k;

            str += '<td>';

            for ( k = 0; k < kdOneDay.length; k++ ) {

              str += '<p class="hohoge">';
              str += kdOneDay[k].kyouka;
              str += '(' + kdOneDay[k].contents + ')';
              str += '</p>';
            }
            str += '<p class="' + configMap.tContentClassName + '">課題追加</p></td>';
          }
        }
      }
      jqueryMap.$main.append(str);
    }
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

    stateMap.kd = kadai.model.getKadai();

    createTable();

    // 重複して登録すると、何度もイベントが発行される。それを避けるため、一旦削除
    $(document).off('click');

    // 「課題」のセルをクリックしたら、入力画面へ

    $(document).on('click', '.' + configMap.tContentClassName, function (event) {
      let weeks = kadai.util.getWeek(configMap.year,
                                     configMap.month-1, //月だけ0始まり
                                     configMap.day),
          gyouIndex  = this.parentNode.rowIndex, // 取得方法のサンプル。未使用。
//          retusIndex = this.cellIndex;
retusIndex = this.parentNode.cellIndex;

      // -1は左端に「課題」のセルがある分の補正
      $.gevent.publish('inputKadai', [weeks[retusIndex-1]]);
    });

    jqueryMap.$previousWeek
      .click( onPrevious );
    jqueryMap.$back
      .click( onBack );
    jqueryMap.$nextWeek
      .click( onNext );


    $(document).on('click', '.hohoge', function (event) {
      console.log('*******************************');
    })


    return true;
  }

  removeCalendar = function ( ) {
    //初期化と状態の解除
    if ( jqueryMap != null ) {
      if ( jqueryMap.$container ) {
        jqueryMap.$previousWeek.remove();
        jqueryMap.$back.remove();
        jqueryMap.$nextWeek.remove();
        jqueryMap.$main.remove();
      }
    }
    return true;
  }

  return {
    configModule  : configModule,
    initModule    : initModule,
    removeCalendar: removeCalendar
  };
}());
