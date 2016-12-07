//Trigger content script
function createGuide() {
  console.log("open");
   //TODO polyfill

  chrome.tabs.executeScript(null, {
    file: "/content_scripts/generate.js"
  });
}

//Open new tab with style guide
function openGuide(message) {
  console.log(message);
  chrome.tabs.create({
    'url': chrome.extension.getURL('styleguide.html')
  });
}

//browser action button listener
chrome.browserAction.onClicked.addListener(createGuide);

//listener for content-scripts message
browser.runtime.onMessage.addListener(openGuide);
