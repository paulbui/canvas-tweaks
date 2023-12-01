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
  let parser = document.createElement("a");
  parser.href = window.location.href;
  var course = parser.pathname.split("/")[2];

  //parse student ID
  //window.location.href.match(/student_id=\d+$/)
  //url.substr(90+"student_id".length+1)


  // Get current student name
  let currentStudentButton = document.getElementById(
    "students_selectmenu-button"
  );

    let currentStudentName = 

  let students_selectmenu = document.getElementById("students_selectmenu");
  for (let i = 0; students_selectmenu.clientHeight; i++) {
    let current_child = students;
  }
})();
