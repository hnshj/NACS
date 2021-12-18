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
        tContents : String()
          + '<td class="kadai-calendar-edit">',
        settable_map : { year  : true,
                         month : true,
                         day   : true},
        year  : 0,
        month : 0,
        day   : 0
      },
      stateMap = {
        $container : null
      },
      jqueryMap = {},
      setJqueryMap, configModule, initModule, removeCalendar,
      onPrevious, onBack, onNext, createTable;

  //---DOMメソッド---
  setJqueryMap = function () {
    let $container = stateMap.$container;
    jqueryMap = {
      $container   : $container,
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
    $.gevent.publish('inputNikka', [obj]);
  }

  onBack = function () {
    let day = new Date(), obj;

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('inputNikka', [obj]);
  }

  onNext = function () {
    let day = new Date(configMap.year, configMap.month - 1, configMap.day), obj;

    day.setDate(day.getDate() + (1*7));

    obj = { year  : day.getFullYear(),
            month : day.getMonth() + 1, //月だけ0始まり
            day   : day.getDate()};
    $.gevent.publish('inputNikka', [obj]);
  }

  //---ユーティリティメソッド---
  createTable = function () {

    let i, j, str, weeks, calOneDay,
        //年月日を指定して該当の日の分を引き当てる
        selectfunc = function ( year, month, day ) {
          return function ( target ) {
            if (target.year == year && target.month == month && target.day == day) {
              return true;
            }
          };
        },
        kadaiContents = []; //何度も検索するのがもったいないので、カレンダーを検索した結果を保存しておく。(1週間分)

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
          /* ここで課題をいれる
          str += configMap.tbNikka;
          //-1は最初の一つが「課題」でずれるから
          calOneDay = stateMap.cl.find(selectfunc(weeks[i-1].year, weeks[i-1].month, weeks[i-1].day));
          if ( calOneDay != null ) {
            if ( calOneDay.nikka != null ) {
              str += calOneDay.nikka;
            }
          */
          str += '<td>現代文完答22/論理的文章第五回</td>';
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

    createTable();

    // 重複して登録すると、何度もイベントが発行される。それを避けるため、一旦削除
    $(document).off('click');
    $(document).off('blur');

    // 出欠または理由が選択されたらON/OFFする。
    $(document).on('click', '.kadai-calendar-edi', function (event) {
      let beforeVal = $(this).html();

      if (beforeVal == 'A') {
        $(this).html('B');
      } else if (beforeVal == 'B') {
        $(this).html("");
      } else {
        $(this).html('A');
      }
    });

    // memoがクリックされたらテキストボックスを用意する
    $(document).on('click', '.kadai-calendar-edimemo', function (event) {
      let temp = $(this).text(),
          more = $('.hoge').val(); // テキストボックスをさらにクリックしたときに
                                   // 入力テキストが消える対応
      if (more != null) {
        temp += more;
      }

      $(this).html('<input class="hoge" type="text" value="' + temp + '">');

      $('.hoge').focus();
    });

    //テキストボックスからフォーカスが外れたら入力されていた値をセルに設定する
    $(document).on('blur', '.hoge', function () {

      $('.hoge').parent().html($('.hoge').val());

    });

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
