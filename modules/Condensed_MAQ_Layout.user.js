// ==UserScript==
// @name         Condensed MAQ Layout
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.2
// @description  Condensed layout of the Canvas Modules, Assignments, & Quizzes pages
// @author       Paul Bui
// @match        http*://*/courses/*/modules
// @match        http*://*/courses/*/assignments
// @match        http*://*/courses/*/quizzes
// @grant        none
// @run-at       document-body
// ==/UserScript==

(function() {
    'use strict';

    var sheet = document.createElement('style');
    sheet.innerHTML = ".context_module {margin-top: 0px !important;}";
    sheet.innerHTML += ".item-group-condensed {padding : 0px !important;}";
    sheet.innerHTML += ".item-group-condensed .ig-header {padding : 0px 0px !important; margin-top: 1px !important;}";
    sheet.innerHTML += ".ig-list .ig-row {padding: 1px 0px 1px 0px !important;}";
    sheet.innerHTML += ".ig-list {font-size : 0.9rem !important;}"
    sheet.innerHTML += ".locked_title {font-size : 1rem !important;}";
    document.body.appendChild(sheet);

})();
