/* global chrome */
let received = false;
var defaultText = 'The quick brown fox jumps over the lazy dog';
var defaultStyleText = 'Aa';

var safeFonts = [
  'arial',
  'helvetica',
  'times new roman',
  'times',
  'courier new',
  'courier',
  'palatino',
  'verdana',
  'georgia',
  'vomic sans ms',
  'trebuchet ms',
  'arial black',
  'impact',
  'monospace',
  'sans-serif',
  'serif',
  'tahoma',
  'andale mono'
];

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message && !received) {
    setSource(message.title, message.address);
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

// COLORS ACTIONS

function addColor(item, type) {
  var card = document.createElement('li');
  card.classList.add('color');

  var swatch = document.createElement('div');
  swatch.classList.add('circleSwatch');
  swatch.style.backgroundColor = item;

  var hex = convertColors(item);
  var desc = makeLink('#' + hex, 'http://www.colorhexa.com/' + hex)
  desc.classList.add('colorDesc');

  var section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  section.appendChild(card);
}

function convertColors(color) {
  function componentToHex(component) {
    var hexodec = component.toString(16);
    return hexodec.length == 1 ? '0' + hexodec : hexodec;
  }
  var parsed = color.replace('rgb(', '')
                    .replace(')', '')
                    .split(', ')
                    .map(el => {
                      var hexodec = parseInt(el).toString(16);
                      return hexodec.length == 1 ? '0' + hexodec : hexodec;
                    });
  return parsed.join('');
}

// FONTS ACTIONS

function addFont(item, type) {
  var goalFont = item.split(',')[0].replace(/"/g, '');

  var card = document.createElement('li');
  card.classList.add('font');

  var swatch = document.createElement('h5');
  swatch.classList.add('fontSwatch');
  swatch.textContent = defaultText;
  if (safeFonts.includes(goalFont.toLowerCase())) {
    swatch.style.fontFamily = item;
    var desc = document.createElement('h5');
    desc.classList.add('fontDesc');
    desc.textContent = goalFont;
  } else {
    loadFonts(goalFont, swatch);
    var desc = makeLink(goalFont, 'https://fonts.google.com/specimen/' + goalFont)
    desc.classList.add('fontDesc');
  }

  var section = document.getElementById(type);
  card.appendChild(desc);
  card.appendChild(swatch);
  section.appendChild(card);
}

function addFontStyle(item, type, style) {
  var card = document.createElement('li');
  card.classList.add('style');
  var swatch = document.createElement('div');
  swatch.classList.add('styleSwatch');

  var text = document.createElement('span');
  text.classList.add('styleText');
  var atr =  'font-' + style + ':' + item;
  text.setAttribute('style', atr);
  text.textContent = defaultStyleText;
  swatch.appendChild(text);

  var desc = document.createElement('span');
  desc.classList.add('styleDesc');
  desc.textContent = style + ': ' +item;

  var section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  section.appendChild(card);
}

function loadFonts(fontName, element) {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.id = fontName;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'http://fonts.googleapis.com/css?family=' + fontName;
  head.appendChild(link);
  element.style.fontFamily = fontName;
}

function setSource(title, address) {
  var titleLink = makeLink(title, address)
  var heading = document.getElementById('source');
  heading.appendChild(titleLink);
}

function makeLink(title, address) {
  var link = document.createElement('a');
  link.textContent = title;
  link.title = title;
  link.href = address;
  return link;
}
