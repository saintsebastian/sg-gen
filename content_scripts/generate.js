/* global NodeFilter browser */

var fonts = [];
var colors = [];
var bgs = [];

function getAllInfo(cb) {
  // loop through all dom elements
  var nodeIterator = document.createNodeIterator(
    document.body,
    NodeFilter.SHOW_ELEMENT);
  var currentNode;

  while (currentNode = nodeIterator.nextNode()) {
    var style = window.getComputedStyle(currentNode);
    var top = style.getPropertyValue('font-family');
    fonts.push(style.getPropertyValue('font'));
    fonts.push(top);
    colors.push(currentNode.style.color);
    bgs.push(currentNode.style.backgroundColor);
  }
  cb(fonts, colors, bgs);
}

var unwanted = ['', 'inherit', 'transparent'];

function unique(value, index, self) {
  return self.indexOf(value) === index && unwanted.indexOf(value) < 0;
}

// send message to the script

function sendCollected(f, c, b) {
  f = f.filter(unique);
  c = c.filter(unique);
  b = b.filter(unique);
  browser.runtime.sendMessage({fonts: f, colors: c, bgs: b});
}

getAllInfo(sendCollected);
