var fonts = [];
var colors =[];
var bgs = [];


function getAllInfo(cb) {
  //loop through all dom elements
  var nodeIterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_ELEMENT);

  var currentNode;

  while (currentNode = nodeIterator.nextNode()) {
      fonts.push(currentNode.style.font);
      fonts.push(currentNode.style.fontFamily);
      colors.push(currentNode.style.color);
      bgs.push(currentNode.style.backgroundColor);
  }

  var f = fonts.filter(unique);
  var c = colors.filter(unique);
  var b = bgs.filter(unique);


  cb(f,c,b);
}

function unique(value, index, self) {
    return self.indexOf(value) === index;
}



//send message to the script
//window.addEventListener("click", sendCollected);

function sendCollected(f,c,b) {
  console.log(f);
  console.log(c);
  console.log(b);


  browser.runtime.sendMessage({font: f, color: c, bg: b});
}


getAllInfo(sendCollected);

console.log(f);
console.log(c);
console.log(b);
