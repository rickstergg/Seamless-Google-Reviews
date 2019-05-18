window.addEventListener('load', getRestaurantNames, false);

async function getRestaurantNames() {
  const selector = '.u-text-ellipsis';
  while(!document.querySelector(selector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  const restaurantNames = document.querySelectorAll(selector);
  
  chrome.runtime.sendMessage({names: restaurantNames}, function(response) {
    console.log(response.received);
  });
}