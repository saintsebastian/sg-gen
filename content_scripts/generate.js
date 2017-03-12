/* global chrome location */

const unwanted = ['', 'inherit', 'transparent'];

var fonts = [];
var colors = [];
var bgs = [];

function getAllInfo(cb) {
  var items = document.getElementsByTagName('*');
  for (var i = items.length; i--;) {
    var style = window.getComputedStyle(items[i]);
    var top = style.getPropertyValue('font-family');
    fonts.push(style.getPropertyValue('font'));
    fonts.push(top);
    colors.push(items[i].style.color);
    bgs.push(items[i].style.backgroundColor);
  }
  cb(fonts, colors, bgs);
}

function unique(value, index, self) {
  return self.indexOf(value) === index && unwanted.indexOf(value) < 0;
}

// send message to the script

function sendCollected(f, c, b) {
  f = f.filter(unique);
  c = c.filter(unique);
  b = b.filter(unique);
  chrome.runtime.sendMessage({
    title: document.title,
    address: location.href,
    data: {fonts: f, colors: c, bgs: b}
  });
}

getAllInfo(sendCollected);
