/* global chrome */
let received = false;
var defaultText = 'The quick brown fox jumps over the lazy dog';

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message && !received) {
    console.table(message.data);
    for (let i in message.data)
      addCard(message.data[i], i);
    setSource(message.title, message.address);
    console.log('set')
    received = true;
  }
}

function addCard(row, type) {
  for (let i of row) {
    if (type !== 'fonts' && type !== 'fontsStyles') {
      addColor(i, type);
    } else {
      addFont(i, type)
    }
  }
}

function addColor(item, type) {
  console.log(item, type);
  var card = document.createElement('li');
  card.classList.add('color');
  var swatch = document.createElement('div');
  swatch.classList.add('circleSwatch');
  swatch.style.backgroundColor = item;
  var desc = document.createElement('h5');
  desc.classList.add('colorDesc');
  desc.innerHTML = item;
  var section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  console.log(section);
  section.appendChild(card);
}

function addFont(item, type) {
  var card = document.createElement('li');
  card.classList.add('font');
  var swatch = document.createElement('span');
  swatch.classList.add('fontSwatch');
  var text = document.createTextNode(defaultText);
  swatch.setAttribute('style', 'font-family:' + item);
  swatch.appendChild(text);
  var desc = document.createElement('h5');
  desc.classList.add('fontDesc');
  desc.innerHTML = item;
  var section = document.getElementById(type);
  card.appendChild(desc);
  card.appendChild(swatch);
  section.appendChild(card);
}

function setSource(title, address) {
  console.log(title, address);
  var titleLink = document.createElement('a');
  var titleText = document.createTextNode(title);
  titleLink.appendChild(titleText);
  titleLink.title = title;
  titleLink.href = address;
  var heading = document.getElementById('source');
  heading.appendChild(titleLink);
}
