/*
 * kadai.js
 * ルート名前空間モジュール
 */
let kadai = (function () {
  'use strict';

  let initModule = function ( $container ) {
    kadai.model.initModule();
    kadai.shell.initModule($container);
  }

  return { initModule : initModule };
}());
