window.addEventListener('load', getRestaurantNames, false);

createGoogleRating = (percentage, userRatingCount) => {
  let node = document.createElement('div');
  node.className = 'google-ratings';
  node.innerHTML = `
    <div class="content-container">
      <div class="google-ratings-top" style="width: ${percentage}%">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <div class="google-ratings-bottom">
        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
      </div>
      <div class="google-rating-count">${userRatingCount} G ratings</div>
    </div>
  `;

  return node;
}

async function getRestaurantNames() {
  const restaurantNameSelector = 'h5.u-text-ellipsis';
  while(!document.querySelector(restaurantNameSelector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  let names = [];
  document.querySelectorAll(restaurantNameSelector).forEach((node) => names.push(node.innerText));

  chrome.runtime.sendMessage({ names, message: 'getRestaurantNames' }, (resp) => {
    document.querySelectorAll('.restaurantCard-rating').forEach((node, index) => {
      if (resp.api[index] && !resp.api[index].error) {
        const {
          rating,
          userRatingCount,
        } = resp.api[index];

        node.parentNode.replaceChild(
          createGoogleRating(rating * 20, userRatingCount),
          node
        );
      } else {
        console.log('Could not replace ', names[index]);
      }
    });
  });
}
