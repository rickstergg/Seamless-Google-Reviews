window.addEventListener('load', getRestaurantNames, false);

async function getRestaurantNames() {
  const restaurantNameSelector = '.u-text-ellipsis';
  while(!document.querySelector(restaurantNameSelector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  let names = [];
  const nodes = document.querySelectorAll(restaurantNameSelector).forEach((node) => names.push(node.innerText));
  
  chrome.runtime.sendMessage({names: names}, function(response) {
    console.log(response);
  });
}