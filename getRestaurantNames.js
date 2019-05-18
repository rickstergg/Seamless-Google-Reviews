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
  const restaurantNameSelector = '.u-text-ellipsis';
  while(!document.querySelector(restaurantNameSelector)) {
    await new Promise(r => setTimeout(r, 1000));
  }

  let names = [];
  const nodes = document.querySelectorAll(restaurantNameSelector).forEach((node) => names.push(node.innerText));
  
  chrome.runtime.sendMessage({ names: names }, (response) => {
    const {
      name,
      rating,
      userRatingCount,
    } = response;

    if (rating && userRatingCount) {
      const seamlessRatingNode = document.querySelector('.restaurantCard-rating');
      seamlessRatingNode.parentNode.replaceChild(createGoogleRating(rating * 20, userRatingCount), seamlessRatingNode); 
    } else {
      console.log('Could not replace Seamless goodies for ' + name);
    }
  });
}