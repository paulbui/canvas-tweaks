/*
 * GradeBoxTweaks adds additional efficiency shortcuts to the Canvas Speedgrader grade box
 *
 * It was developed by Paul Bui
 *
 * This is the script source that does all of the work, but should not be directly installed.
 * It is loaded by a separate user script that installed into Tampermonkey.
 *
 * See https://github.com/paulbui/canvas-tweaks
 *
 */

var GradeBoxTweaks = function (config) {
  "use strict";

  if (typeof config === "undefined") {
    //by default, both features are turned on (change true to false if you want it turned off)
    var config = {
      autoSelect: true,
      enterAdvance: true,
    };
  }

  const gradeBox = document.getElementById("grading-box-extended");

  if (gradeBox && config.autoSelect) {
    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (const mutation of mutationsList) {
        /*
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                }
                else if (mutation.type === 'attributes') {
                    console.log('The ' + mutation.attributeName + ' attribute was modified.');

                }
                */
        if (
          document.activeElement !==
          document.getElementById("speed_grader_comment_textarea")
        ) {
          gradeBox.focus();
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(gradeBox, config);
  }

  if (gradeBox && config.enterAdvance) {
    gradeBox.addEventListener("keyup", (event) => {
      if (event.isComposing || event.keyCode === 13) {
        var commentButton = document.getElementById("comment_submit_button");
        if (commentButton) {
          commentButton.dispatchEvent(
            new Event("click", {
              bubbles: true,
            })
          );
        }

        var nextStudentButton = document.getElementById("next-student-button");
        if (nextStudentButton) {
          nextStudentButton.dispatchEvent(
            new Event("click", {
              bubbles: true,
            })
          );
        }
      }
    });
  }

  var commentArea = document.getElementById("speed_grader_comment_textarea");
  if (commentArea && config.enterAdvance) {
    commentArea.addEventListener("keyup", (event) => {
      if (event.ctrlKey && event.keyCode === 13) {
        var commentButton = document.getElementById("comment_submit_button");
        if (commentButton) {
          commentButton.dispatchEvent(
            new Event("click", {
              bubbles: true,
            })
          );
        }
        var nextStudentButton = document.getElementById("next-student-button");
        if (nextStudentButton) {
          nextStudentButton.dispatchEvent(
            new Event("click", {
              bubbles: true,
            })
          );
        }
        gradeBox = document.getElementById("grading-box-extended");
        gradeBox.focus();
      }
    });
  }
};

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
})(this, function () {
  return GradeBoxTweaks;
});
