/* global chrome */
let received = false;

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message && !received) {
    console.log(message);
    for (let i in message.data)
      addCard(message.data[i], i);
    setSource(message.title, message.address);
    received = true;
  }
}

function addCard(row, type) {
  for (let i of row) {
    var card = document.createElement('li');
    card.classList.add('card');
    var swatch = document.createElement('div');
    swatch.classList.add('swatch');
    if (type !== 'fonts')
      swatch.style.backgroundColor = i;
    else
      swatch.style.backgroundColor = 'red';
    var desc = document.createElement('span');
    desc.classList.add('desc');
    desc.innerHTML = i;
    var section = document.getElementById(type);
    console.log(section);
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
