/*Requirements:
The user must be able to search for parks in one or more states.
The user must be able to set the max number of results, with a default of 10.
The search must trigger a call to NPS's API.
The parks in the given state must be displayed on the page. Include at least:
Full name
Description
Website URL
The user must be able to make multiple searches and see only the results for the current search.
As a stretch goal, try adding the park's address to the results.*/

const apiKey = "B84sI5wVOXQwODDsa5G0KNgJCajRBXCapV0mJhw3";
let stateInput;
const searchURL = `https://developer.nps.gov/api/v1/parks`;
// What a successful string should look like
// https://developer.nps.gov/api/v1/parks?stateCode=NY&stateCode=Nj&api_key=gscyriCbUaLQhpdq0CyUmfWBG4GzbJZZ9S1Vz6Ed
function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(key => `${key}=${params[key]}`);
  return queryItems.join("&");
}

function getParkInfo(query, maxResults = 10) {
  console.log("`getParkInfo` ran");
  const stateQuery = stateInput.split(",").map(state => state.trim());
  console.log(stateQuery);
  const params = {
    api_key: apiKey,
    stateCode: stateQuery,
    limit: maxResults,
    start: 0
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + "?" + queryString;
  console.log(url);
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $("#js-error-message").text(`Something went wrong: ${err.message}`);
    });
}
/* fetch(url)
.then(response => response.json())
.then(responseJson => console.log(responseJson));
*/

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    const searchTerm = $("#js-search-term").val();
    const maxResults = $("#js-max-results").val();
    stateInput = $("#js-search-term").val();
    getParkInfo(searchTerm, maxResults);
  });
}

// Handling the response
function displayResults(responseJson, maxResults) {
  // if there are previous results, remove them
  console.log(responseJson);
  $("#results-list").empty();
  // iterate through the data array, stopping at the max number of results
  for (let i = 0; (i < responseJson.data.length) & (i < maxResults); i++) {
    // for each object in the data
    //array, add a list item to the results
    //list with the source(URL), fullName,
    // and description
    $("#results-list").append(
      `<li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
        <!-- Address --> 
        </li>`
    );
  }
  //display the results section
  $("#results").removeClass("hidden");
}
function main() {
  watchForm();
}
$(main);