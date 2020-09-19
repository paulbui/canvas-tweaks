// ==UserScript==
// @name         Grade Box Tweaks
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.1
// @description  Auto-select grade box in SpeedGrader | Enter in Grade box submits and advances to next student
// @author       Paul Bui
// @match        https://*.instructure.com/courses/*/gradebook/speed_grader?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
  
    var config = {
        autoSelect: true,
        enterAdvance: true
    };
  
    if (typeof GradeBoxTweaks !== 'function') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/paulbui/canvas-tweaks@master/gradebox_tweaks/src/gradebox_tweaks.js';
      script.onload = function() {
        GradeBoxTweaks(config);
      };
      document.head.appendChild(script);
    }
    else {
        GradeBoxTweaks(config);
    }
  
  })();