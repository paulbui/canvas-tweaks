// ==UserScript==
// @name         Clear Zeroed Late Submissions
// @namespace    https://github.com/paulbui/canvas-tweaks/
// @version      0.1
// @description  Find all late submissions that have a 0 score, and offer to clear the score
// @author       Paul Bui
// @match        https://*.instructure.com/courses/*/gradebook
// @grant        none
// @require      file://C:\Users\paulb\OneDrive\Documents\Userscripts\canvas-tweaks\clear_zeroed_late_submissions\clear_zeroed_late_submissions.user.js
// ==/UserScript==

(function () {
  'use strict';

  const base = document.location.origin;

  


  /*
  // Watch the URL for query string changes
  function track(fn, handler, before) {
    return function interceptor() {
      if (before) {
        handler.apply(this, arguments)
        return fn.apply(this, arguments)
      } else {
        var result = fn.apply(this, arguments)
        handler.apply(this, arguments)
        return result
      }
    }
  }

  var oldQs = location.search

  // Handle all navigation changes
  function handler() {
    console.log("hello");

  }

  history.pushState = track(history.pushState, handler)
  history.replaceState = track(history.replaceState, handler)
  window.addEventListener('onpopstate', handler);
  */
})();