// ==UserScript==
// @name         Course Shortcuts
// @namespace    https://github.com/paulbui
// @version      0.1
// @description  Add tabs for different courses at the top of the screen
// @author       Paul Bui
// @match        https://*.instructure.com/courses/*
// @grant        none
// ==/UserScript==

(function() {
  'use strict';

  //YOU SHOULD MODIFY THE FOLLOWING LIST OF COURSE NAMES AND COURSE ID NUMBERS!
  //"COURSE_NAME" : COURSE_ID # that is found in the URL after the word "courses"
  var courseNumDict = {
      "AP CS A" : 59098,
      "IB CS 1" : 59216,
      "IB CS 2" : 59218
  };

  //DO NOT MODIFY ANYTHING BELOW THIS COMMENT

  if (document.location.href.indexOf("speed_grader") != -1 || document.body.classList.contains("is-inside-submission-frame"))
  {
      return;
  }
  

  var wrapper = document.getElementById("wrapper");
  if (wrapper)
  {
      var newDiv = document.createElement("div");
      newDiv.setAttribute("style", "margin-left: 24px");

      for (let courseStr in courseNumDict)
      {
          var newA = document.createElement("a");
          newA.innerHTML = courseStr;
          newA.setAttribute("class", "btn btn-primary");
          newA.setAttribute("style", "margin-right: 4px");
          newA.href = "javascript:void(0)";
          newA.onclick = function() {
              const regex = /(.*\/courses\/)\d+(.*)/;
              const URL = document.location.href;
              const newURL = URL.replace(regex, "$1"+courseNumDict[courseStr]+"$2");
              window.location.href = newURL;
          };
          newDiv.append(newA);
      }

      wrapper.insertAdjacentElement('afterbegin', newDiv);
  }
})();

