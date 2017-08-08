/* global chrome */

// NECESSARY VARIABLES
let received = false;
let googleFonts;
const defaultText = 'The quick brown fox jumps over the lazy dog';
const defaultStyleText = 'Aa';

// COMMUNICATION

chrome.runtime.sendMessage({response: true});
chrome.runtime.onMessage.addListener(insertStyles);

// HELPERS

function setSource(title, address) {
  const titleLink = makeLink(title, address, 'source ')
  const heading = document.getElementById('source');
  heading.appendChild(titleLink);
}

function makeLink(title, address, linkinfo) {
  const link = document.createElement('a');
  link.textContent = title;
  link.title = title;
  link.href = address;
  link.setAttribute('aria-label', linkinfo + title);
  link.target = '_blank';
  return link;
}

// GENERATE THE STYLE GUIDE

function insertStyles(message) {
  if (message && !received) {
    console.table(message.data);
    received = true;
    googleFonts = message.googleFonts;
    setSource(message.title, message.address);
    for (let i in message.data)
      addCard(message.data[i], i);
  }
}

function addCard(row, type) {
  for (let i of row) {
    if (type === 'fonts')
      checkFont(i, type);
    else if (type === 'style' || type === 'weight')
      addFontStyle(i, 'styles', type);
    else
      addColor(i, type);
  }
}

// COLORS ACTIONS

function addColor(item, type) {
  const card = document.createElement('li');
  card.classList.add('color');

  const swatch = document.createElement('div');
  swatch.classList.add('circleSwatch');
  swatch.style.backgroundColor = item;

  const {hex, opacity} = convertColors(item);
  const desc = makeLink('#' + hex, 'http://www.colorhexa.com/' + hex, 'color ');
  desc.classList.add('colorDesc');
  const section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  if (opacity < 1) {
    console.log(hex, opacity);
    const opacityDesc = document.createElement('span');
    opacityDesc.classList.add('opacityDesc');
    opacityDesc.textContent = 'Opacity: ' + opacity;
    card.appendChild(opacityDesc);
  }
  section.appendChild(card);
}

function convertColors(color) {
  const rgba = new RegExp('rgba');
  const replacer = rgba.test(color) ? 'rgba(' : 'rgb(';
  const parsed = color.replace(replacer, '')
    .replace(')', '')
    .split(', ');
  const opacity = parsed.length === 4 ? parsed.pop() : 1;
  const hex = parsed.map(el => {
      const hexodec = parseInt(el).toString(16);
      return hexodec.length == 1 ? '0' + hexodec : hexodec;
    }).join('');
  return {hex, opacity};
}

// FONTS ACTIONS

const safeFonts = [
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

function checkFont(item, type) {
  const goalFont = item.split(',')[0].replace(/"/g, '');
  if(safeFonts.includes(goalFont.toLowerCase())) {
    addFreeFont(item, type, goalFont, false);
  } else if (googleFonts.includes(goalFont)) {
    addFreeFont(item, type, goalFont, true);
  } else
    addProprietaryFont(item, goalFont);
}

function addFreeFont(item, type, goalFont, link) {
  const card = document.createElement('li');
  card.classList.add('font');

  const swatch = document.createElement('h5');
  swatch.classList.add('fontSwatch');
  swatch.textContent = defaultText;
  swatch.style.fontFamily = item;
  let desc;
  if (link) {
    desc = makeLink(
      goalFont,
      'https://fonts.google.com/specimen/' + goalFont,
      'font famliy '
    );
    desc.classList.add('fontDesc');
    loadFonts(goalFont, swatch);
  } else {
    desc = document.createElement('h5');
    desc.textContent = goalFont;
  }
  desc.classList.add('fontDesc');
  const section = document.getElementById(type);
  card.appendChild(desc);
  card.appendChild(swatch);
  section.appendChild(card);
}

function addProprietaryFont(item, goalFont) {
  if (document.getElementById('prop').textContent === '') {
    document.getElementById('prop').textContent = 'Proprietary Typefaces';
  }
  const card = document.createElement('li');
  card.classList.add('pFont');

  const desc = document.createElement('h5');
  desc.classList.add('pFontDesc');
  desc.textContent = goalFont;

  const section = document.getElementById('pFonts');
  card.appendChild(desc);
  section.appendChild(card);
}

function addFontStyle(item, type, style) {
  const card = document.createElement('li');
  card.classList.add('style');
  const swatch = document.createElement('div');
  swatch.classList.add('styleSwatch');

  const text = document.createElement('span');
  text.classList.add('styleText');
  const atr =  'font-' + style + ':' + item;
  text.setAttribute('style', atr);
  text.textContent = defaultStyleText;
  swatch.appendChild(text);

  const desc = document.createElement('span');
  desc.classList.add('styleDesc');
  desc.textContent = style + ': ' +item;

  const section = document.getElementById(type);
  card.appendChild(swatch);
  card.appendChild(desc);
  section.appendChild(card);
}

function loadFonts(fontName, element) {
  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.id = fontName;
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'http://fonts.googleapis.com/css?family=' + fontName;
  head.appendChild(link);
  element.style.fontFamily = fontName;
}
