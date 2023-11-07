// ==UserScript==
// @name         SpeedGrader Load Ungraded
// @namespace    https://github.com/paulbui
// @version      0.1
// @description  Adds buttons to Speedgrader to load next ungraded submission(s)
// @author       Paul Bui
// @include      https://*.instructure.com/courses/*/gradebook/speed_grader?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
     // Set your Base URL here. Used for all API calls.
    const base = document.location.origin;

    // A little hack to quickly extract the course ID from the URL
    let parser = document.createElement('a');
    parser.href = window.location.href;
    var course = parser.pathname.split('/')[2]

    // Watch the URL for query string changes
    function track (fn, handler, before) {
        return function interceptor () {
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

    // Store the URL
    var oldQs = location.search

    var originalStatus;
    var seconds_late;

    function statusChangeHandler(e) {
        // Prevent a page reload
        e.preventDefault();
        //var customSelect = document.querySelector("#customSelect");

        let days_late = document.getElementById("days_late");
        if (this.value == "late")
        {
            days_late.disabled = false;
            days_late.value = (seconds_late / SECONDS_PER_DAY).toFixed(2);
        }
        else
            document.getElementById("days_late").disabled = true;

    }

    // Run when the select option is changed on the assignment.
    function putStatus(e) {

        // Prevent a page reload
        e.preventDefault();
        
        // Check the URL you're on to make sure it's in the speedgrader
        if (/^\/courses\/[0-9]+\/gradebook\/speed_grader$/.test(window.location.pathname)) {
            const params = new URLSearchParams(window.location.search);
            
            // Store the query strings for the assignment, student, and selected status
            let assignment = params.get("assignment_id");
            let student = params.get("student_id")

            let status = document.getElementById("customSelect").value;
            let gradebox = document.getElementById("grading-box-extended");
            let days_late = document.getElementById("days_late");

            if (status == "excused")
                gradebox.value = "EX";
            else if (status == "none" && (gradebox.value == "EX" || gradebox.value == "0"))
                gradebox.value = "";

            // Bake some JSON
            var data;
            if (days_late.value.length > 0)
            {
                data = {
                    "submission": {
                        "excuse" : status == "excused",
                        "late_policy_status" : status == "excused" ? null : status,
                        "seconds_late_override" : days_late.value*SECONDS_PER_DAY,
                    }
                }
            }
            else
            {
                data = {
                    "submission": {
                        "excuse" : status == "excused",
                        "late_policy_status" : status == "excused" ? null : status,
                    }
                }
            }

            $.ajax({
                url:`${base}/api/v1/courses/${course}/assignments/${assignment}/submissions/${student}`,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: function(resp) {
                    //console.log(resp);
                    seconds_late = resp.seconds_late;

                    if (status === "late" || originalStatus === "late")
                        location.reload();
                    else
                        $(`#confirm`).animate({
                            opacity: 1},100).animate({
                                opacity: 0},2000);
                },
                error: function(err) {
                    console.log(err)
                },
            })
       }
    }

    // Handle all navigation changes
    function handler() {
        
        // Check for the custom select box
        var customSelect = document.querySelector("#customSelect");
        
        // If it's not there, put it there
        if(!customSelect) {
            const container = document.querySelector("#grade_container");
            const div = document.createElement("div");
            // Style the div so the checkbox stays inside
            div.style = "margin-top: 5px";

            const label = document.createElement("label");
            label.style = "font-weight: bold; margin-right: 5px";
            label.innerHTML = "Status: ";
            div.appendChild(label);

            // Option value strings for the API call
            const choices = ["none", "late", "missing", "excused"]
            
            // Make a select, set the ID, add to the container.
            const select = document.createElement("select");
            select.id = "customSelect";
            select.style = "width: 100px; margin-right: 5px";
            div.appendChild(select);

            // Add the span for confirmation &#10003
            const span = document.createElement("span");
            span.innerHTML = "<span id='confirm' style='opacity:0;'>Updated</span>";
            div.appendChild(span)


            // Add the <option> els to the select.
            for (var i in choices) {
                var option = document.createElement("option");
                option.value = choices[i];
                
                // Set the choice string for display
                option.text = choices[i].charAt(0).toUpperCase() + choices[i].slice(1);
                select.appendChild(option);
            }

            container.append(div);

            const daysLateDiv = document.createElement("div");

            const label2 = document.createElement("label");
            label2.style = "font-weight: bold; margin-right: 5px";
            label2.innerHTML = "Days Late: ";
            daysLateDiv.appendChild(label2);

            // Copied from gradebook: <input locale="en" min="0" type="text" inputmode="numeric" value="17.38">
            const daysLateInput = document.createElement("input");
            daysLateInput.id = "days_late";
            daysLateInput.min = "0";
            daysLateInput.type = "number";
            daysLateInput.step = ".5";
            daysLateInput.style = "width: 60px; margin-right: 5px";
            //daysLateInput.inputmode = "numeric";
            daysLateDiv.appendChild(daysLateInput);

            const updateButton = document.createElement("button");
            updateButton.class = "Button Button--primary";
            updateButton.type = "button";
            updateButton.innerHTML = "Update Status";
            daysLateDiv.appendChild(updateButton);

            container.append(daysLateDiv);

            // Listen for those events
            //select.addEventListener("change", putStatus);
            select.addEventListener("change", statusChangeHandler);
            updateButton.addEventListener("click", putStatus);
        }

        // If it's there, check the URL and make sure it's on the speedgrader.
        if (/^\/courses\/[0-9]+\/gradebook\/speed_grader$/.test(window.location.pathname)) {
            
            // Get the select item
            customSelect = document.querySelector("#customSelect");
            
            // Get the assignment and student IDs for posting
            const params = new URLSearchParams(window.location.search);
            let assignment = params.get("assignment_id");
            let student = params.get("student_id")
            $.ajax({
                url: `${base}/api/v1/courses/${course}/assignments/${assignment}/submissions/${student}`,
                method: 'GET',
                success: function(resp) {
                    // "None" is actually a null value from Canvas. Make that show "None" instead.
                    if (resp.excused)
                        customSelect.value = "excused";
                    else if (resp.missing)
                        customSelect.value = "missing";
                    else if (resp.late)
                        customSelect.value = "late";
                    else
                        customSelect.value = "none";

                    seconds_late = resp.seconds_late;
                    originalStatus = resp.late_policy_status;

                    if (customSelect.value != "late")
                    {
                        document.querySelector("#days_late").value = "";
                        document.querySelector("#days_late").disabled = true;
                    }
                    else
                        document.querySelector("#days_late").value = (seconds_late / SECONDS_PER_DAY).toFixed(2);

                    //resp.late_policy_status does not work!
                    //(resp.late_policy_status == null) ? customSelect.value = "none" : customSelect.value = resp.late_policy_status;
                    //console.log(`Success!: ${JSON.stringify(resp, null, 2)}`);
                },
                error: function(err) {
                    console.log(`Error: ${err}`)
                },
            });

            // Update the current location
            oldQs = location.search
        } else {
            return
        }
    }

    // Add all the listeners to make sure we don't miss a page change.
    history.pushState = track(history.pushState, handler)
    history.replaceState = track(history.replaceState, handler)
    window.addEventListener('onpopstate', handler);
})();
