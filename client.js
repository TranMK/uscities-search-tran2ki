var CityInput = document.getElementById('city-prompt');
var sendBtnElm = document.getElementById('send-button');
CityInput.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("send-button").click();
  }
});
sendBtnElm.addEventListener('click', send);
function send() {
    var message = CityInput.value.trim();
    if (!message) return;   // AC-02.2: empty messages are ignored
    console.log(`Debug>City: ${message}`); //for UI testing only
    // other AC will be implemented
    CityInput.value = ''; // AC-01.5: clear input after sending
    CityInput.focus();
}