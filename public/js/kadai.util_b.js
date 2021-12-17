/*
 * kadai.util_b.js
 * javascriptブラウザユーティリティ
 *
 * Michael S. Mikowski - mmikowski at gmail dot com
 * これらは、webからひらめきを得て、
 * 1998年から作成、コンパイル、アップデートを行ってきたルーチン。
 *
 * MITライセンス
 *
 */

kadai.util_b = (function () {
   'use strict';

   let
     configMap = {
       regex_encode_html  : /[&"'><]/g,
       regex_encode_noamp : /["'><]/g,
       html_encode_map    : {
         '&' : '&#38;',
         '"' : '&#34;',
         "'" : '&#39;',
         '>' : '&#62;',
         '<' : '&#60;'
       }
     },

     decodeHtml,  encodeHtml, getEmSize;

   configMap.encode_noamp_map = $.extend(
     {}, configMap.html_encode_map
   );
   delete configMap.encode_noamp_map['&'];


   // パブリックメソッド/decodeHtml/
   // HTMLエンティティをブラウザに適した方法でデコードする。
   // http://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
   // 参照
   decodeHtml = function ( str ) {
     return $('<div/>').html(str || '').text();
   };

   // パブリックメソッド/encodeHtml/
   // これはhtmlエンティティのための単一パスエンコーダであり
   // 任意の数の文字に対応する。
   encodeHtml = function ( input_arg_str, exclude_amp ) {
     let
       input_str = String( input_arg_str ),
       regex, lookup_map
       ;

     if ( exclude_amp ) {
       lookup_map = configMap.encode_noamp_map;
       regex      = configMap.regex_encode_noamp;
     }
     else {
       lookup_map = configMap.html_encode_map;
       regex      = configMap.regex_encode_html;
     }
     return input_str.replace(regex,
       function ( match, name ) {
         return lookup_map[ match ] || '';
       }
     );
   };

   // パブリックメソッド/getEmSize/
   // emのサイズをピクセルで返す。
   getEmSize = function ( elem ) {
     return Number(
       getComputedStyle( elem, '' ).fontSize.match(/\d*\.?\d*/)[0]
     );
   };

   return {
     decodeHtml : decodeHtml,
     encodeHtml : encodeHtml,
     getEmSize  : getEmSize
   };
 }());
