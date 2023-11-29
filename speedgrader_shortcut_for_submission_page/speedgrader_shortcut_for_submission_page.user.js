// ==UserScript==
// @name         Speedgrader Shortcut for Submission Page
// @namespace    https://github.com/paulbui
// @version      0.1
// @description  Adds a shortcut to the speedgrader when on a particular student's submission's page
// @author       Paul Bui
// @match        https://*.instructure.com/courses/*/assignments/*/submissions/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //extract assignment number
    //extract submission number
    let parser = document.createElement('a');
    parser.href = window.location.href;
    //console.log(parser.href);
    //console.log(parser.hostname);

    let splitHref = parser.pathname.split('/');
    let course = splitHref[2];
    let assignment = splitHref[4];
    let student_id = splitHref[6];
    //console.log(splitHref);

    let contentDiv = document.getElementById("content");

    //hack to only add button to outer content div
    if (contentDiv.firstElementChild.tagName === "STYLE")  
    {
        let submissionDetailsHeader = document.getElementsByClassName("submission-details-header submission_details");

        let speedgraderButton = document.createElement("a");
        speedgraderButton.innerHTML = "Open in Speedgrader";
        speedgraderButton.setAttribute("class", "btn btn-primary");
        speedgraderButton.setAttribute("style", "margin-right: 4px");
        speedgraderButton.href = `https://${parser.hostname}/courses/${course}/gradebook/speed_grader?assignment_id=${assignment}&student_id=${student_id}`;

        contentDiv.firstElementChild.insertAdjacentElement('afterend', speedgraderButton);
    }
})();
