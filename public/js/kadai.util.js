/*
 * kadai.util.js
 * 汎用javascriptユーティリティ
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * これらは、webからひらめきを得て、
 * 1998年から作成、コンパイル、アップデートを行ってきたルーチン。
 *
 * MITライセンス
 *
 * makeErrorとsetConfigMapは上記
 * 以降は追加したもの。
 */

kadai.util = (function () {
  'use strict';

  let makeError, setConfigMap, isEmpty, makeDateStr, getWeek,
      getDayOfCalendar, getPreviousBusinessDay, getNextBusinessDay,
      daySelectf, sortCalendarf, monthAndDaySelectf;

  // パブリックコンストラクタ/makeError/
  makeError = function ( name_text, msg_text, data ) {
    let error     = new Error();
    error.name    = name_text;
    error.message = msg_text;

    if ( data ){ error.data = data; }

    return error;
  };

  // パブリックメソッド/setConfigMap/
  setConfigMap = function ( arg_map ){
    let
      input_map    = arg_map.input_map,
      settable_map = arg_map.settable_map,
      config_map   = arg_map.config_map,
      key_name, error;

    for ( key_name in input_map ){
      if ( input_map.hasOwnProperty( key_name ) ){
        if ( settable_map.hasOwnProperty( key_name ) ){
          config_map[key_name] = input_map[key_name];
        }
        else {
          error = makeError( 'Bad Input',
            'Setting config key |' + key_name + '| is not supported'
          );
          throw error;
        }
      }
    }
  };

  // オブジェクトが空かどうか判定
  isEmpty = function (obj) {
    return !Object.keys(obj).length;
  }

  // 日付を文字列で生成
  // dayOffsetは指定日からどれだけずらすかを指定する
  // 1 なら翌日
  // -1 なら前日
  makeDateStr = function (y, m, d, dayOffset=0) {
    let today,
        dayOfWeek = ['日','月','火','水','木','金','土'];

    if ( y === undefined || m === undefined || d === undefined ) {
      today = new Date();
    } else {
      today = new Date(y, m, d);
    }

    if ( dayOffset !=  0 ) {
      today.setDate(today.getDate() + dayOffset);
    }

    return (today.getMonth() + 1) + '/' + //月だけ0始まり
            today.getDate() +
            '(' + dayOfWeek[today.getDay()] + ')';
  }

  // 指定の日を含む一週間のリスト(日曜始まり)を生成
  // weekOffsetは指定日からどれだけずらすかを指定する
  // 1 なら翌週
  // -1 なら先週
  getWeek = function (y, m, d, weekOffset=0) {
    let today, i, startSunday, retList = [];

    if ( y === undefined || m === undefined || d === undefined ) {
      today = new Date();
    } else {
      today = new Date(y, m, d);
    }

    if ( weekOffset !=  0 ) {
      today.setDate(today.getDate() + weekOffset*7 );
    }

    // 週の始まりの日曜を取得
    startSunday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    startSunday.setDate(today.getDate() - today.getDay());

    for (i = 0; i < 7; i++) {
      retList.push({
        year  : startSunday.getFullYear(),
        month : startSunday.getMonth() + 1, //月だけ0始まり
        day   : startSunday.getDate()
      })

      startSunday.setDate(startSunday.getDate() + 1);
    }
    return retList;
  }

  // 指定日が営業日かどうか判定する。
  // カレンダー情報
  // [{"year":2021, "month":10, "day":1, "nikka":"A"}
  //  ,{"year":2021, "month":10, "day":2, "nikka":"A"}・・・
  // が必要。
  //
  // 戻り値 はオフジェクト
  // result : treu   営業日
  //        : false  営業日でない
  // nikka  : A or B
  // gyouji : 行事(あれば)
  getDayOfCalendar = function (y, m, d, calendar) {
    if (calendar != null) {
      let day = calendar.find(daySelectf(y,m,d));

      if (day != undefined) {
        day.result = true;
        return day;
      }
    }
    return {result:false};
  }

  daySelectf = function (y, m, d) {
    return function ( target ) {
      if ((target.year == y) && (target.month == m) && (target.day == d)) {
        return true;
      }
    };
  }

  // カレンダーをソートするときの比較関数
  sortCalendarf = function (a, b) {
    if (a.year < b.year) {
      return -1;
    } else if (a.year == b.year) {
      if (a.month < b.month) {
        return -1;
      } else if (a.month == b.month) {
        if (a.day < b.day) {
          return -1;
        } else if (a.day == b.day) {
          return 0;
        } else if (a.day > b.day) {
          return 1;
        }
      } else if (a.month > b.month) {
        return 1;
      }
    } else if (a.year > b.year) {
      return 1;
    }
  }

  // 月と日を指定して該当日を引き当てる
  monthAndDaySelectf = function ( month, day ) {
    return function ( target ) {
      if (target.month == month && target.day == day) {
        return true;
      }
    };
  }

  // 指定日の前の営業日を返す。
  // カレンダーを必要とし、さらに、カレンダーは日付順にソートされいてる前提。
  getPreviousBusinessDay = function (year, month, day, calendar) {
    let i, calendarDay,
        obj = { year : year, month : month, day : day},
        shiteibi = new Date(year, month - 1, day);

    if (calendar != null) {
      for (i=0; i < calendar.length; i++) {
        calendarDay = new Date(calendar[i].year,
                               calendar[i].month - 1,
                               calendar[i].day);
        if (shiteibi.getTime() <= calendarDay.getTime()) {
          break;
        }
      }
      if (i == 0) {
        obj.year  = calendar[0].year;
        obj.month = calendar[0].month;
        obj.day   = calendar[0].day;
      } else {
        obj.year  = calendar[i-1].year;
        obj.month = calendar[i-1].month;
        obj.day   = calendar[i-1].day;
      }
    }
    return obj;
  }

  getNextBusinessDay = function (year, month, day, calendar) {
    let i, calendarDay,
        obj = { year : year, month : month, day : day},
        shiteibi = new Date(year, month - 1, day);

    if (calendar != null) {
      for (i=0; i < calendar.length; i++) {
        calendarDay = new Date(calendar[i].year,
                               calendar[i].month - 1,
                               calendar[i].day);
        if (shiteibi.getTime() == calendarDay.getTime()) {
          if (i == calendar.length-1) {
            obj.year  = calendar[calendar.length-1].year;
            obj.month = calendar[calendar.length-1].month;
            obj.day   = calendar[calendar.length-1].day;
          } else {
            obj.year  = calendar[i+1].year;
            obj.month = calendar[i+1].month;
            obj.day   = calendar[i+1].day;
          }
          break;
        } else if (shiteibi.getTime() < calendarDay.getTime()) {
          obj.year  = calendar[i+1].year;
          obj.month = calendar[i+1].month;
          obj.day   = calendar[i+1].day;
          break;
        }
      }
    }
    return obj;
  }

  return {
    makeError    : makeError,
    setConfigMap : setConfigMap,
    isEmpty      : isEmpty,
    makeDateStr  : makeDateStr,
    getWeek      : getWeek,
    getDayOfCalendar       : getDayOfCalendar,
    getPreviousBusinessDay : getPreviousBusinessDay,
    getNextBusinessDay     : getNextBusinessDay,
    sortCalendarf          : sortCalendarf,
    monthAndDaySelectf     : monthAndDaySelectf
  };
}());
