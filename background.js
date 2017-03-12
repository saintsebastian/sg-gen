/* global chrome */

var data;

// Trigger content script
function createGuide() {
  chrome.tabs.executeScript(null, {
    file: '/content_scripts/generate.js'
  });
}

// Open new tab with style guide
function openGuide(message) {
  if (message.response) {
    chrome.runtime.sendMessage(data);
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
chrome.runtime.onMessage.addListener(openGuide);
