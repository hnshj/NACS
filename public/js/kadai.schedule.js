/*
 * kadai.calendar.js
 * カレンダー表示モジュール
 */
kadai.schedule = (function () {
  'use strict';

  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<button class="kadai-schedule-previousWeek">前の週</button>'
          + '<button class="kadai-schedule-back">今週へ戻る</button>'
          + '<button class="kadai-schedule-nextWeek">次の週</button>'
          + '<table class="kadai-schedule-main"></table>',
        tHeader : String()
          + '<tr class="day"><td>曜日</td>'
          + '<td class="sun" class="day">日</td>'
          + '<td class="day">月</td>'
          + '<td class="day">火</td>'
          + '<td class="day">水</td>'
          + '<td class="day">木</td>'
          + '<td class="day">金</td>'
          + '<td class="sat" class="day">土</td></tr>',
        tblankClassName : String()
          + 'kadai-schedule-blank',
        tregisterdKadaiClassName : String()
          + 'kadai-schedule-registerd',
        taddKadaiClassName : String()
          + 'kadai-schedule-addition',
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
      $previousWeek: $container.find( '.kadai-schedule-previousWeek' ),
      $back        : $container.find( '.kadai-schedule-back' ),
      $nextWeek    : $container.find( '.kadai-schedule-nextWeek' ),
      $main        : $container.find( '.kadai-schedule-main' )
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
          str += '<td>１時間目</td>';
        } else {
          // ここで課題をいれる

          //-1は最初の一つが「課題」でずれるから
          kdOneDay = stateMap.kd.filter(selectfunc(weeks[i-1].year, weeks[i-1].month, weeks[i-1].day));
          if ( kdOneDay.length == 0 ) {
            str += '<td class="' + configMap.tblankClassName + '"></td>';

          } else {
            let k;

            str += '<td>';

            for ( k = 0; k < kdOneDay.length; k++ ) {

              str += '<p class="' + configMap.tregisterdKadaiClassName + '" ';
              str += 'id ="' + kdOneDay[k]._id + '" >';
              str += kdOneDay[k].contents[kdOneDay[k].contents.length-1]
                     + ':'
                     + kdOneDay[k].kyouka[kdOneDay[k].kyouka.length-1]
                     + '</p>';
            }
            str += '<p class="' + configMap.taddKadaiClassName + '">もっと追加する</p></td>';
            }
        }
      str += '</td>'
  }
    str += '<tr>';
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
            str += '<td class="' + configMap.tblankClassName + '"></td>';

          } else {
            let k;

            str += '<td>';

            for ( k = 0; k < kdOneDay.length; k++ ) {

              str += '<p class="' + configMap.tregisterdKadaiClassName + '" ';
              str += 'id ="' + kdOneDay[k]._id + '" >';
              str += kdOneDay[k].contents[kdOneDay[k].contents.length-1]
                     + ':'
                     + kdOneDay[k].kyouka[kdOneDay[k].kyouka.length-1]
                     + '</p>';
            }
            str += '<p class="' + configMap.taddKadaiClassName + '">もっと追加する</p></td>';
            }
        }
      str += '</td>'
  }
  str += '<tr>';
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
            str += '<td class="' + configMap.tblankClassName + '"></td>';

          } else {
            let k;

            str += '<td>';

            for ( k = 0; k < kdOneDay.length; k++ ) {

              str += '<p class="' + configMap.tregisterdKadaiClassName + '" ';
              str += 'id ="' + kdOneDay[k]._id + '" >';
              str += kdOneDay[k].contents[kdOneDay[k].contents.length-1]
                     + ':'
                     + kdOneDay[k].kyouka[kdOneDay[k].kyouka.length-1]
                     + '</p>';
            }
            str += '<p class="' + configMap.taddKadaiClassName + '">もっと追加する</p></td>';
            }
        }
      str += '</td>'
      }
      str += '<tr>';
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
            str += '<td class="' + configMap.tblankClassName + '"></td>';

          } else {
            let k;

            str += '<td>';

            for ( k = 0; k < kdOneDay.length; k++ ) {

              str += '<p class="' + configMap.tregisterdKadaiClassName + '" ';
              str += 'id ="' + kdOneDay[k]._id + '" >';
              str += kdOneDay[k].contents[kdOneDay[k].contents.length-1]
                     + ':'
                     + kdOneDay[k].kyouka[kdOneDay[k].kyouka.length-1]
                     + '</p>';
            }
            str += '<p class="' + configMap.taddKadaiClassName + '">もっと追加する</p></td>';
            }
        }
      str += '</td>'
      }
      }
      jqueryMap.$main.append(str);
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

    createTable()


    jqueryMap.$previousWeek
      .click( onPrevious );
    jqueryMap.$back
      .click( onBack );
    jqueryMap.$nextWeek
      .click( onNext );

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
