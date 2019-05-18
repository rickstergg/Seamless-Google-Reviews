window.addEventListener('load', getRestaurantNames, false);

async function getRestaurantNames() {
  const selector = '.u-text-ellipsis';
  while(!document.querySelector(selector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  const restaurantNames = document.querySelectorAll(selector);
  restaurantNames.forEach(function (node) { console.log(node.innerText) });
}
