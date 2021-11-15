// ==UserScript==
// @name         Missing Assignments List
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.24
// @updateURL    https://raw.githubusercontent.com/paulbui/canvas-tweaks/master/missing_assignments_list/missing_assignments_list.user.js
// @description  Adds list of missing assignments to right sidebar
// @author       Paul Bui
// @match        http*://*.instructure.com
// @match        http*://*.instructure.com/courses/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    //const logTime = function printTime() { console.log(new Date().today() + " @ " + new Date().timeNow()); }

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
        let totalMissingCount = 0;
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
                    totalMissingCount++;
                }
            });

            let rightSideBar = document.getElementById("right-side");
            let sidebar = document.getElementById("right-side-wrapper");
            const missingDiv = document.createElement("div");
            missingDiv.id = "missing-list";
            missingDiv.style = "font-size: 0.9rem; color:" + (totalMissingCount > 0 ? "red" : "green");
            missingDiv.className = "todo-list";

            const missingHeader = document.createElement("h4");
            missingHeader.className = "todo-list-header";
            missingHeader.style = "color:" + (totalMissingCount > 0 ? "red" : "green");
            missingHeader.innerHTML = "Missing Assignments";
            missingDiv.appendChild(missingHeader);

            const missingList = document.createElement("ul");
            missingList.style = "margin: 0px; list-style-type: none;";

            const hiddenDiv = document.createElement("div");
            hiddenDiv.id = "hidden-missing-list";
            hiddenDiv.style = "display: none";
            hiddenDiv.innerHTML = "<p>TEST</p>";

            let hiddenButton = document.createElement("button");
            hiddenButton.style = "Button";
            hiddenButton.innerHTML = "<i>Hidden</i>";
            hiddenButton.addEventListener("click", function() {
                let divToReveal = document.getElementById("hidden-missing-list");
                console.log(divToReveal.style);

                //FIXME: checking if style === "display" does *not* work and is never true
                if (divToReveal && divToReveal.style === "display: block")
                {
                    //FIXME: if-statement is never true...
                    console.log("hide!");
                    divToReveal.style = "display: none";
                }
                else
                {
                    console.log("reveal!");
                    divToReveal.style = "display: block";
                }
            }, false);

            const hiddenList = document.createElement("ul");
            //hiddenList.style = "margin: 0px; list-style-type: none;";
            //hiddenList.innerHTML = "<li><center><i>Hidden</i></center></li>";


            if (window.location.pathname === "/")
            {
                if (Object.keys(coursesWithMissing).length === 0)
                {
                    missingList.innerHTML = "<li>None</li>";
                }
                else
                {
                    missingList.innerHTML += "<li style='margin-bottom: 8px; '>"+totalMissingCount+" missing assignment(s) total:</li>";
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
                if (!coursesWithMissing[courseId]) //no missing assignments
                {
                    missingHeader.style = "color:green";
                    missingList.style = "margin: 0px; list-style-type: none; color:green";
                    missingList.innerHTML = "<li>None</li>";
                }
                else
                {

                    let hideButton = document.createElement("button");

                    for(const missingAssignment of favoriteCourseIds[courseId.toString()].missingAssignments)
                    {
                        let missingListElement = document.createElement("li");
                        missingListElement.style = "margin-bottom: 8px";
                        missingListElement.innerHTML = `<a style='color:red' href="${missingAssignment.html_url}">${missingAssignment.name}</a>`;

                        let missingListHideButton = document.createElement("button");
                        missingListHideButton.className = "Button Button--icon-action disable_item_link disable-todo-item-link";
                        missingListHideButton.style = "float: right;";
                        missingListHideButton.setAttribute("title", "Hide");
                        missingListHideButton.innerHTML = `<i class="icon-off"></i`; //check if missing assignment is hidden or not
                        missingListHideButton.addEventListener("click", function() {
                            let myStorage = window.localStorage;
                            let i = myStorage.getItem("test");
                            if (!i)
                            {
                                myStorage.setItem("test", 1);
                                console.log("First click!");
                            }
                            else
                            {
                                i++;
                                console.log(i);
                                myStorage.setItem("test", i);
                            }

                        }, false);
                        missingListElement.appendChild(missingListHideButton);
                        missingList.appendChild(missingListElement);
                    }
                    missingList.appendChild(hiddenButton);
                    missingList.appendChild(hiddenDiv);
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
