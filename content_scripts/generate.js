/* global chrome location */

const unwanted = ['', 'inherit', 'transparent'];

var fonts = [];
var styles = [];
var weights =[];
var colors = [];
var bgs = [];

function getAllInfo(cb) {
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
  cb(fonts, styles, weights, colors, bgs);
}

function unique(value, index, self) {
  return self.indexOf(value) === index && unwanted.indexOf(value) < 0;
}

// send message to the script

function sendCollected(f, fs, fw, c, b) {
  f = f.filter(unique);
  fs = fs.filter(unique);
  fw = fw.filter(unique);
  c = c.filter(unique);
  b = b.filter(unique);
  chrome.runtime.sendMessage({
    title: document.title,
    address: location.href,
    // data: {fonts: f, colors: c, bgs: b}
    data: {fonts: f, colors: c, bgs: b, style: fs, weight: fw}
  });
}

getAllInfo(sendCollected);
