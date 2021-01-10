// ==UserScript==
// @name         Missing Assignments List
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.1
// @description  Adds list of missing assignments to right sidebar
// @author       Paul Bui
// @match        http*://*.instructure.com/courses/*
// @grant        none
// @run-at document-end
// @require      file:///Users/wlcs/canvas-tweaks/missing_assignments_list/missing_assignments_list.user.js
// ==/UserScript==

(function () {
  'use strict';

  console.log("hello");

  const sidebar = document.getElementById("course_show_secondary");
  //const courseShowDiv = document.getElementById("course_show_secondary");
  //const todoDiv = document.getElementsByClassName("todo-list")[0];

  const missingDiv = document.createElement("div");
  missingDiv.id = "missing-list";
  missingDiv.className = "todo-list";

  const missingHeader = document.createElement("h2");
  missingHeader.className = "h2 shared-space";
  missingHeader.style = "color:red";
  missingHeader.innerHTML = "Missing Assignments"
  missingDiv.appendChild(missingHeader);

  const missingList = document.createElement("ul");
  missingList.style = "margin: 0px; list-style-type: none";
  missingList.innerHTML = "<li>Test</li>";
  missingDiv.appendChild(missingList);

  //sidebar.insertBefore(missingDiv, todoDiv);
  sidebar.appendChild(missingDiv);

})();
