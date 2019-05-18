window.addEventListener('load', getRestaurantNames, false);

async function getRestaurantNames() {
  const selector = '.u-text-ellipsis';
  while(!document.querySelector(selector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  let names = [];
  const nodes = document.querySelectorAll(selector).forEach((node) => names.push(node.innerText));
  
  chrome.runtime.sendMessage({names: names}, function(response) {
    console.log(response);
  });
}