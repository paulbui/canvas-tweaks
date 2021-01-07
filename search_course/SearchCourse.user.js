// ==UserScript==
// @name         Search Course
// @namespace    https://github.com/paulbui/
// @version      0.1
// @description  Search engine tools for Instructure Canvas course Pages, Assignments, Quizzes, etc.
// @author       Paul Bui
// @match        http*://*/courses/*/pages
// @grant        none
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/fuse.js/dist/fuse.js
// ==/UserScript==
//TODO: other header items to add later: license, run-at, updateURL

//fetch() example from https://learntech.imsu.ox.ac.uk/blog/working-with-the-canvas-api-in-plain-js-pt-1/

(async function () {
  "use strict";

  const courseID = ENV.COURSE_ID;

  console.log("Fetching assignments file...");
  let assignments = await fetchAssignments(courseID);

  //FUSE DOCUMENTATION: https://fusejs.io/api/indexing.html

  const options = { keys: ['name', 'description'] }
   
  const myIndex = Fuse.createIndex(['name', 'description'], assignments)

  console.log("Creating index file...");

  //writing index file to local system (should be changed to upload to Canvas)
  let a = document.createElement("a");
  let file = new Blob([JSON.stringify(myIndex.toJSON())], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "fuse-index.json";
  a.click();
  URL.revokeObjectURL(a.href);

  const fuseIndex = await require('fuse-index.json')
  const myIndex2 = Fuse.parseIndex(fuseIndex)
  // initialize Fuse with the index
  const fuse = new Fuse(?????, options, myIndex2)

  

})();

async function fetchAssignments(courseID) {
  var assignmentIDs = [];

  let csrfToken = getCsrfToken();

  //console.log('crsfToken', csrfToken);

  //TODO: loop until no next link to deal wtih pagination

  var nextURL = `/api/v1/courses/${courseID}/assignments`;
  let paginating = true;

  while (paginating) {
    await fetch(nextURL, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-CSRF-Token": csrfToken,
      },
    })
      .then(status)
      .then(function (response) {
        for (let pair of response.headers.entries()) {
          if (pair[0] === "link") {
            //find the link header entry
            //console.log(pair[0] + ": " + pair[1]);
            let linksArrStr = pair[1].split(",");

            let currentURL = "";
            let lastURL = "";

            for (let linkStr of linksArrStr) {
              let linkPair = linkStr.split("; ");

              //get next URL if it exists
              if (linkPair[1] === 'rel="next"') {
                nextURL = linkPair[0].substring(1, linkPair[0].length - 1); //remove <> brackets around URL
                break;
              }
              if (linkPair[1] === 'rel="last"') {
                currentURL = linkPair[0].substring(1, linkPair[0].length - 1);
              }
              if (linkPair[1] === 'rel="current"') {
                lastURL = linkPair[0].substring(1, linkPair[0].length - 1);
              }
            }
            if (currentURL === lastURL) paginating = false;

            break;
          }
        }

        return response.json();
      })
      .then(function (data) {
        //console.log(data);
        for (let assignment of data) {
          assignmentIDs.push(assignment.id);
        }
      })
      .catch(function (error) {
        console.log("Listing all pages request failed", error);
      });
  }

  //console.log(assignmentIDs);

  let assignments = [];

  for (let assignmentID of assignmentIDs) {
    //GET assignment from ID
    let getSingleAssignmentURL = `/api/v1/courses/${courseID}/assignments/${assignmentID}`;

    await fetch(getSingleAssignmentURL, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "X-CSRF-Token": csrfToken,
      },
    })
      .then(status)
      .then((response) => response.json())
      .then(function (data) {
        //console.log("Success", data);
        let fetchedAssignment = {};
        fetchedAssignment.id = data.id;
        fetchedAssignment.name = data.name;
        fetchedAssignment.description = data.description;
        fetchedAssignment.html_url = data.html_url;
        //console.log("Success", fetchedAssignment);
        assignments.push(fetchedAssignment);
        // console.log(typeof(fetchedAssignment));
        // console.log(JSON.stringify(fetchedAssignment));
      })
      .catch(function (error) {
        console.log("Getting single page request failed", error);
      });
  }

  return assignments;
}

/*
 * Function which returns csrf_token from cookie see: https://community.canvaslms.com/thread/22500-mobile-javascript-development
 */
function getCsrfToken() {
  var csrfRegex = new RegExp("^_csrf_token=(.*)$");
  var csrf;
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i].trim();
    var match = csrfRegex.exec(cookie);
    if (match) {
      csrf = decodeURIComponent(match[1]);
      break;
    }
  }
  return csrf;
}

/* * Function which returns a promise (and error if rejected) if response status is OK */
function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}
