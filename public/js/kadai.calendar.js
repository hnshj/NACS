/*
 * kadai.calendar.js
 * カレンダー表示モジュール
 */
kadai.calendar = (function () {
  'use strict';

  var startMonth = [];
  var lastMonth = [];
  
  //---モジュールスコープ変数---
  let configMap = {
        main_html : String()
          + '<button class="kadai-calendar-previousWeek">前の週</button>'
          + '<button class="kadai-calendar-back">今週へ戻る</button>'
          + '<button class="kadai-calendar-nextWeek">次の週</button>'
          + '<table class="kadai-calendar-main"></table>'
          + '<div class="sMonth">'
          + startMonth
          + '</div>'
          + '<div class="lMonth">'
          + lastMonth
          + '</div>',
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
          + 'kadai-calendar-blank',
        tbTodayClsName : String()
          + '<td class="kadai-calendar-today">',
        tregisterdKadaiClassName : String()
          + 'kadai-calendar-registerd',
        taddKadaiClassName : String()
          + 'kadai-calendar-addition',
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
      onPrevious, onBack, onNext, onSchedule, onMemo, createTable;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
      $previousWeek: $container.find( '.kadai-calendar-previousWeek' ),
      $back        : $container.find( '.kadai-calendar-back' ),
      $nextWeek    : $container.find( '.kadai-calendar-nextWeek' ),
      $schedule    : $container.find( '.kadai-calendar-schedule' ),
      $memo        : $container.find( '.kadai-calendar-memo' ),
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

  onSchedule = function(){
    //時間割を表示する
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('schedule')
    window.alert("schedule")
  }

  onMemo = function () {
    //memo
    $.gevent.publish('memo');
    window.alert("memo")
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
    
    str = '<table id="calendar">'
    for (j = 0; j < 4; j++) {
      weeks = kadai.util.getWeek(configMap.year,
                               configMap.month-1, //月だけ0始まり
                               configMap.day,
                               j);
    //曜日あたり１行目：日付
    str = '<tr>';
      for (i = 0; i < 8; i++) {
        if (i == 0) {
          str += '<td>日付</td>';
        } else {
          if (j == 0 && i == 1){
            startMonth = String(weeks[i-1].month);
          } else if (j == 4 && i == 7){
            lastMonth = String(weeks[i-1].month);
          }
          str += '<td>';
          //-1は最初の一つが「日付」でずれるから
          str += String(weeks[i-1].day);
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
    str += '</table>'
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

    // 空白セルをクリックしたら、入力画面へ
    $(document).on('click', '.' + configMap.tblankClassName, function (event) {
      let tateIndex = $(this).closest('tr').index(), // ヘッダが1行で、0始まりだから1から
       temp = $(this).text();
      console.log(tateIndex)
      
      let nansyume = tateIndex / 2 - 1;
      let weeks = kadai.util.getWeek(configMap.year,
                                     configMap.month-1, //月だけ0始まり
                                     configMap.day,
                                     nansyume),
          retusIndex = this.cellIndex;

      // -1は左端に「課題」のセルがある分の補正
      $.gevent.publish('inputKadai', [ { year     : weeks[retusIndex-1].year,
                                         month    : weeks[retusIndex-1].month,
                                         day      : weeks[retusIndex-1].day,
                                         kadaiId  : "",
                                         contents : "",
                                         kyouka   : "" } ]);
      //
      
      console.log(tateIndex);
      console.log(nansyume);
    });

    // 課題を追加をクリックしたら、入力画面へ
    $(document).on('click', '.' + configMap.taddKadaiClassName, function (event) {
      let tateIndex = $(this).closest('tr').index(), // ヘッダが1行で、0始まりだから1から
       temp = $(this).text();
      console.log(tateIndex)
      
      let nansyume = tateIndex / 2 - 1;
      let weeks = kadai.util.getWeek(configMap.year,
                                     configMap.month-1, //月だけ0始まり
                                     configMap.day,
                                     nansyume),
          retusIndex = this.parentNode.cellIndex;

      // -1は左端に「課題」のセルがある分の補正
      $.gevent.publish('inputKadai', [ { year     : weeks[retusIndex-1].year,
                                         month    : weeks[retusIndex-1].month,
                                         day      : weeks[retusIndex-1].day,
                                         kadaiId  : "",
                                         contents : "",
                                         kyouka   : "" } ]);
    });

    // 課題をクリックしたら、入力画面へ
    $(document).on('click', '.' + configMap.tregisterdKadaiClassName, function (event) {
      let tateIndex = $(this).closest('tr').index(), // ヘッダが1行で、0始まりだから1から
       temp = $(this).text();
      console.log(tateIndex)
      
      let nansyume = tateIndex / 2 - 1;
      let weeks = kadai.util.getWeek(configMap.year,
                                     configMap.month-1, //月だけ0始まり
                                     configMap.day,
                                     nansyume),
          retusIndex = this.parentNode.cellIndex,
          clist = this.innerHTML.split(':');

      // -1は左端に「課題」のセルがある分の補正
      $.gevent.publish('inputKadai', [ { year     : weeks[retusIndex-1].year,
                                         month    : weeks[retusIndex-1].month,
                                         day      : weeks[retusIndex-1].day,
                                         kadaiId  : this.id,
                                         contents : clist[0],
                                         kyouka   : clist[1] }]);
    });

    jqueryMap.$previousWeek
      .click( onPrevious );
    jqueryMap.$back
      .click( onBack );
    jqueryMap.$nextWeek
      .click( onNext );
    jqueryMap.$schedule
      .click( onSchedule );
    jqueryMap.$memo
      .click( onMemo );
    return true;
  }

  removeCalendar = function ( ) {
    //初期化と状態の解除
    if ( jqueryMap != null ) {
      if ( jqueryMap.$container ) {
        jqueryMap.$previousWeek.remove();
        jqueryMap.$back.remove();
        jqueryMap.$nextWeek.remove();
        jqueryMap.$schedule.remove();
        jqueryMap.$memo.remove();
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
