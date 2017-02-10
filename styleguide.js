/* global browser */
browser.runtime.sendMessage({response: true});

browser.runtime.onMessage.addListener(insertStyles);

function insertStyles(message) {
  if (message) {
    console.log(message);
    for (let i in message)
      addCard(message[i], i);
  }
}

function addCard(row, type) {
  for (let i of row) {
    var card = document.createElement('li');
    card.classList.add('card');
    var swatch = document.createElement('div');
    swatch.classList.add('swatch');
    if (type !== 'fonts')
      swatch.style.backgroundColor = i;
    else
      swatch.style.backgroundColor = 'red';
    var desc = document.createElement('span');
    desc.classList.add('desc');
    desc.innerHTML = i;
    var section = document.getElementById(type);
    console.log(section);
    card.appendChild(swatch);
    card.appendChild(desc);
    section.appendChild(card);
  }
}
