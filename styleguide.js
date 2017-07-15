/* global chrome */
let received = false;

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message && !received) {
    for (let i in message.data)
      addCard(message.data[i], i);
    setSource(message.title, message.address);
    received = true;
  }
}

var defaultText = 'The quick brown fox jumps over the lazy dog';

function addCard(row, type) {
  for (let i of row) {
    var card = document.createElement('li');
    card.classList.add('card');
    var swatch = document.createElement('div');
    swatch.classList.add('swatch');
    if (type !== 'fonts') {
      swatch.style.backgroundColor = i;
    } else {
      swatch.style.backgroundColor = 'white';
      var span = document.createElement('span');
      var text = document.createTextNode(defaultText);
      span.setAttribute('style', 'font-family:' + i);
      span.appendChild(text);
      swatch.appendChild(span);
    }
    var desc = document.createElement('span');
    desc.classList.add('desc');
    desc.innerHTML = i;
    var section = document.getElementById(type);
    card.appendChild(swatch);
    card.appendChild(desc);
    section.appendChild(card);
  }
}

function setSource(title, address) {
  var titleLink = document.createElement('a');
  var titleText = document.createTextNode(title);
  titleLink.appendChild(titleText);
  titleLink.title = title;
  titleLink.href = address;
  var heading = document.getElementById('heading');
  var newline = document.createElement('br');
  heading.appendChild(newline);
  heading.appendChild(titleLink);
}
