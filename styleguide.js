/* global chrome */
let received = false;
var defaultText = 'The quick brown fox jumps over the lazy dog';
var defaultStyleText = 'Aa';

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message && !received) {
    setSource(message.title, message.address);
    console.table(message.data);
    for (let i in message.data)
      addCard(message.data[i], i);
    received = true;
  }
}

function addCard(row, type) {
  for (let i of row) {
    if (type === 'fonts')
      addFont(i, type);
    else if (type === 'style' || type === 'weight')
      addFontStyle(i, 'styles', type);
    else
      addColor(i, type);
  }
}

function addColor(item, type) {
  var card = document.createElement('li');
  card.classList.add('color');

  var swatch = document.createElement('div');
  swatch.classList.add('circleSwatch');
  swatch.style.backgroundColor = item;

  var desc = document.createElement('span');
  desc.classList.add('colorDesc');
  var descText = document.createTextNode(item);
  desc.appendChild(descText);

  var section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  section.appendChild(card);
}

function addFont(item, type) {
  var card = document.createElement('li');
  card.classList.add('font');

  var swatch = document.createElement('h5');
  swatch.classList.add('fontSwatch');
  swatch.setAttribute('style', 'font-family:' + item);
  var text = document.createTextNode(defaultText);
  swatch.appendChild(text);

  var desc = document.createElement('h5');
  desc.classList.add('fontDesc');
  var text = document.createTextNode(item);
  desc.appendChild(text);

  var section = document.getElementById(type);
  card.appendChild(desc);
  card.appendChild(swatch);
  section.appendChild(card);
}

function addFontStyle(item, type, style) {
  console.log(item, type);
  var card = document.createElement('li');
  card.classList.add('style');
  var swatch = document.createElement('div');
  swatch.classList.add('styleSwatch');

  var text = document.createElement('span');
  text.classList.add('styleText');
  var defaultText = document.createTextNode(defaultStyleText);
  var atr =  'font-' + style + ':' + item;
  text.setAttribute('style', atr);
  text.appendChild(defaultText);
  swatch.appendChild(text);

  var desc = document.createElement('span');
  desc.classList.add('styleDesc');
  var descText = document.createTextNode(style + ': ' +item);
  desc.appendChild(descText);

  var section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  section.appendChild(card);

}

function setSource(title, address) {
  var titleLink = document.createElement('a');
  var titleText = document.createTextNode(title);
  titleLink.appendChild(titleText);
  titleLink.title = title;
  titleLink.href = address;
  var heading = document.getElementById('source');
  heading.appendChild(titleLink);
}
