/* global chrome location */

const unwanted = ['', 'inherit', 'transparent'];

var fonts = [];
var styles = [];
var weights =[];
var colors = [];
var bgs = [];

function getAllValues(cb, gf) {
  var items = document.getElementsByTagName('*');
  for (var i = items.length; i--;) {
    var style = window.getComputedStyle(items[i]);
    fonts.push(style.getPropertyValue('font'));
    fonts.push(style.getPropertyValue('font-family'));
    styles.push(style.getPropertyValue('font-style'));
    weights.push(style.getPropertyValue('font-weight'));
    colors.push(style.getPropertyValue('color'));
    bgs.push(style.getPropertyValue('background-color'));
  }
  cb(fonts, styles, weights, colors, bgs, gf);
}

function unique(value, index, self) {
  return self.indexOf(value) === index && unwanted.indexOf(value) < 0;
}

function getGoogleFonts(get, send) {
  const url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyA2OmOnNDbuIAJt89qGrp7BUms9XmLP-Ec';
  let fonts;
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.onload = function() {
    const fonts = JSON.parse(req.responseText);
    const cleanFonts = fonts.items.map(el => el.family);
    get(send, cleanFonts);
  };
  req.send();
}

// send message to the script

function sendCollected(f, fs, fw, c, b, gf) {
  f = f.filter(unique);
  fs = fs.filter(unique);
  fw = fw.filter(unique);
  c = c.filter(unique);
  b = b.filter(unique);
  chrome.runtime.sendMessage({
    data: {
      fonts: f,
      colors: c,
      bgs: b,
      style: fs,
      weight: fw,
    },
    title: document.title,
    address: location.href,
    googleFonts: gf
  });
}

getGoogleFonts(getAllValues, sendCollected);
