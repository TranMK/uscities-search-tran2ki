var searchInput = document.getElementById('city-prompt');
var searchBtnElm = document.getElementById('search-button');
var responseElm = document.getElementById('responses');
searchInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    searchBtnElm.click();
  }
});
//Instant Ajax search - at least 2 characters before suggesting, and debounce ~300ms after the last keystroke
var debounceTimer = null;
searchInput.addEventListener("keyup", function(event){
  if (event.key === 'Enter'){
    clearTimeout(debounceTimer);
    search();
    searchInput.value = ''; //clear the field after an explicit Enter press
    return;
  }
  clearTimeout(debounceTimer);
  var query = searchInput.value.trim();
  if (query.length < 2) return; // AC5: needs at least 2 characters before suggesting
  debounceTimer = setTimeout(search, 300); //AC7: debounce ~300ms after the last keystroke
})
searchBtnElm.addEventListener('click', function(){
  search();
  searchInput.value = '';
});
function send() {
    var message = searchInput.value.trim();
    if (!message) return;   // AC-02.2: empty messages are ignored
    console.log(`Debug>City: ${message}`); //for UI testing only
    // other AC will be implemented
    
}
const BASE_URL = "https://tran2ki-uscities-microservices-hbc6abdvfxgwffaw.canadacentral-01.azurewebsites.net";
async function search(){
  const query = searchInput.value.trim();
  if (!query) return; //AC9: emptyspace queries don't reach fetch
  console.log(`Debug>query: ${query}`); //UI test only
  //searchInput.value = ''; // AC-01.5: clear input after sending
  searchInput.focus();
  try {
    const response = await fetch(`${BASE_URL}/uscities-search/${encodeURIComponent(query)}`);
    if(!response.ok){
      throw new Error('Unexpected status'); //AC4+11: Fail safely, don't open
    }
    const data = await response.json();
    if(!Array.isArray(data)){
      throw new Error('Malformed responses'); //AC10: Validate shape before display
    }
    const newdata = json2htmltable(data);
    displaySearch(newdata);
  }catch (err) {
    console.log(`Debug> search error: ${err.message}`);
    responseElm.textContent = 'Error: could not load results.'; //AC4+11
  }
}
function displaySearch(data) {
  if(!responseElm){
    console.log('Error in getting "responses"');
    return;
  }
  //AC1+2: Matches found - version only shows raw text
  //AC3: No matches - explicit message instead of blank/empty display
  responseElm.innerHTML = data.length === 0 ? 'No cities found' : JSON.stringify(data, null, 2);
}
//AC9+10: Sanitize every field before rendered as HTML
function data_sanitize(v) {
  return DOMPurify.sanitize(v ? String(v) : '');
}
function json2htmllist(data){
  
}
function json2htmltable(data){
  if(!Array.isArray(data) || data.length === 0) return "No cities found."; //AC10+11
  var rows = data.map(function (c){
    return "<tr><td>" + data_sanitize(c.city) + "</td><td>" + data_sanitize(c.state_name) 
    + "</td><td>" + data_sanitize(c.zips) + "</td></tr>";
  }).join('');
  return "<table><tr><th>City</th><th>State</th><th>Zips</th></tr>"+rows+"</table>";
}