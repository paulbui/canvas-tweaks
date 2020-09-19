// ==UserScript==
// @name         Autoselect Grade Box | Enter-Advance
// @namespace    https://github.com/paulbui/canvas-tweaks
// @version      0.1
// @description  Auto-select grade box in SpeedGrader | Enter in Grade box submits and advances to next student
// @author       Paul Bui
// @match        https://*.instructure.com/courses/*/gradebook/speed_grader?*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    //by default, both features are turned on (change true to false if you want it turned off)
    var config = {
        autoSelect: false,
        enterAdvance: true
    };

    const gradeBox = document.getElementById('grading-box-extended');

    if (config.autoSelect)
    {
        // Options for the observer (which mutations to observe)
        const config = { attributes: true, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // Use traditional 'for loops' for IE 11
            for(const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');

                }
                gradeBox.focus();
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(gradeBox, config);

        // Later, you can stop observing
        //observer.disconnect();

    }

    if (config.enterAdvance)
    {
        gradeBox.addEventListener("keyup", function(e) {
            if (e.keyCode === 13) {
                var elements = document.getElementsByClassName('btn btn-primary quizwiz_next');
                if (elements.length === 1)
                {
                    elements[0].click();
                }
            }
        });
    }

})();
