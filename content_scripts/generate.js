/* global chrome location */

const unwanted = ['', 'inherit', 'transparent'];

var fonts = [];
var fontsStyles = [];
var colors = [];
var bgs = [];

function getAllInfo(cb) {
  var items = document.getElementsByTagName('*');
  for (var i = items.length; i--;) {
    var style = window.getComputedStyle(items[i]);
    fonts.push(style.getPropertyValue('font'));
    fonts.push(style.getPropertyValue('font-family'));
    fontsStyles.push(style.getPropertyValue('font-style'));
    colors.push(style.getPropertyValue('color'));
    bgs.push(style.getPropertyValue('background-color'));
  }
  cb(fonts, fontsStyles, colors, bgs);
}

function unique(value, index, self) {
  return self.indexOf(value) === index && unwanted.indexOf(value) < 0;
}

// send message to the script

function sendCollected(f, fs, c, b) {
  f = f.filter(unique);
  fs = fs.filter(unique);
  c = c.filter(unique);
  b = b.filter(unique);
  chrome.runtime.sendMessage({
    title: document.title,
    address: location.href,
    data: {fonts: f, colors: c, bgs: b}
    // data: {fonts: f, colors: c, bgs: b, fontStyles: fs}
  });
}

getAllInfo(sendCollected);
