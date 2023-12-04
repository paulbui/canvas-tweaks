// ==UserScript==
// @name         SpeedGrader Load Ungraded
// @namespace    https://github.com/paulbui
// @version      0.1
// @description  Adds buttons to Speedgrader to load next ungraded submission(s)
// @author       Paul Bui
// @include      https://*.instructure.com/courses/*/gradebook/speed_grader?*
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  // Set your Base URL here. Used for all API calls.
  const base = document.location.origin;

  // A little hack to quickly extract the course ID from the URL
  // let parser = document.createElement("a");
  // parser.href = window.location.href;
  // var course = parser.pathname.split("/")[2];

  //parse current student ID from URL
  let IDregexMatch = window.location.href.match(/\d+$/);
  let currentStudentID = IDregexMatch[0];

  let students_selectmenu = document.getElementById("students_selectmenu");
  let selectMenuChildren = students_selectmenu.children;
  for (let i = 0; selectMenuChildren.length; i++) {
    let current_child = selectMenuChildren[i];

    //found current child in list, then iterate to find next unread
    if (current_child.value == currentStudentID) {
      for (j = i + 1; j < selectMenuChildren.length; j++) {
        if (students_selectmenu.children[j].classList.contains("not_graded")) {
          window.location.href =
            window.location.href.substring(0, IDregexMatch["index"]) +
            students_selectmenu.children[j].value;
          break;
        }
      }
      break;
    }
  }
})();
