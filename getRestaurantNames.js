window.addEventListener('load', getRestaurantNames, false);

function getRestaurantNames() {
  const selector = '.u-text-ellipsis';
  const restaurantNames = document.querySelectorAll(selector);
  restaurantNames.forEach(function (node) { console.log(node.innerText) });
}
