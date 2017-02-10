
/* global chrome browser */

// Trigger content script
function createGuide() {
  chrome.tabs.executeScript(null, {
    file: '/content_scripts/generate.js'
  });
}

var data;

// Open new tab with style guide
function openGuide(message) {
  if (message.response) {
    browser.runtime.sendMessage(data);
  } else {
    data = message;
    chrome.tabs.create({
      'url': chrome.extension.getURL('styleguide.html')
    });
  }
}

// browser action button listener
chrome.browserAction.onClicked.addListener(createGuide);

// listener for content-scripts message
browser.runtime.onMessage.addListener(openGuide);
