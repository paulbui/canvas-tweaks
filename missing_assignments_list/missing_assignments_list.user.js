// ==UserScript==
// @name         Missing Assignments List
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.2
// @description  Adds list of missing assignments to right sidebar
// @author       Paul Bui
// @match        http*://*.instructure.com
// @match        http*://*.instructure.com/courses/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    //FIXME: fetch() calls should deal with pagination

    let hostname = window.location.hostname;
    //list favorite courses
    let favoriteCourses;
    let favoriteCourseIds = {};
    fetch("https://"+hostname+"/api/v1/users/self/favorites/courses", { credentials: 'same-origin' })
        .then(response => response.json())
        .then(data => {
        favoriteCourses = data;
        favoriteCourses.forEach(course => {
            favoriteCourseIds[course.id] = { name: course.name, missingAssignments : [], course : course }
        });

        //get missing assignments
        let coursesWithMissing = {};
        let missingAssignments;
        fetch("https://"+hostname+"/api/v1/users/self/missing_submissions", { credentials: 'same-origin' })
            .then(response => response.json())
            .then(data => {
            missingAssignments = data;
            //console.log(Object.keys(missingAssignments).length);
            missingAssignments.forEach(assignment => {
                if (favoriteCourseIds[assignment.course_id.toString()])
                {
                    //favoriteCourseIds[assignment.course_id.toString()].missingCount++;
                    favoriteCourseIds[assignment.course_id.toString()].missingAssignments.push(assignment);
                    if (coursesWithMissing[assignment.course_id.toString()])
                    {
                        coursesWithMissing[assignment.course_id.toString()]++;
                    }
                    else
                    {
                        coursesWithMissing[assignment.course_id.toString()] = 1;
                    }
                }
            });

            let rightSideBar = document.getElementById("right-side");
            let sidebar = document.getElementById("right-side-wrapper");
            const missingDiv = document.createElement("div");
            missingDiv.id = "missing-list";
            missingDiv.style = "font-size: 0.9rem; color:red";
            missingDiv.className = "todo-list";

            const missingHeader = document.createElement("h4");
            missingHeader.className = "todo-list-header";
            missingHeader.style = "color:red";
            missingHeader.innerHTML = "Missing Assignments"
            missingDiv.appendChild(missingHeader);

            const missingList = document.createElement("ul");
            missingList.style = "margin: 0px; list-style-type: none";

            if (window.location.pathname === "/")
            {
                if (Object.keys(coursesWithMissing).length === 0)
                {
                    missingList.innerHTML = "<li>None</li>";
                }
                else
                {
                    missingList.innerHTML += "<li style='margin-bottom: 8px; '>"+Object.keys(coursesWithMissing).length+" missing assignments total:</li>";
                    for( const key of Object.keys(coursesWithMissing)) {
                        missingList.innerHTML += "<li style='margin-bottom: 8px'>";
                        missingList.innerHTML += "<a style='color:red' href=\"" + window.location.href + "courses/" + key + "\">"
                            + coursesWithMissing[key] + " - " + favoriteCourseIds[key].name + "</a>"
                        missingList.innerHTML += "</li>";
                    }
                }
            }
            else //must be in a course
            {
                let courseId = window.location.pathname.split("/")[2];
                console.log("Inside course# "+courseId);
                console.log(coursesWithMissing[courseId] + " missing assignment");
                if (!coursesWithMissing[courseId])
                {
                    missingList.innerHTML = "<li>None</li>";
                }
                else
                {
                    //iterate through missing assignments here
                    for(const missingAssignment of favoriteCourseIds[courseId.toString()].missingAssignments)
                    {
                        missingList.innerHTML += "<li style='margin-bottom: 8px'>";
                        missingList.innerHTML += "<a style='color:red' href=\"" + missingAssignment.html_url + "\">"
                            + missingAssignment.name + "</a>"
                        missingList.innerHTML += "</li>";
                        console.log(missingAssignment.name);
                        console.log(missingAssignment.html_url);
                    }
                }
            }

            missingDiv.appendChild(missingList);
            sidebar.insertBefore(missingDiv, rightSideBar);

        }).catch(err => {
            console.log("Failed to fetch missing assignments courses");
        });
    }).catch(err => {
        console.log("Failed to fetch favorite courses");
    });
})();
