async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

makeRequest = (url) => {
  return fetch(url)
    .then(response => response.json())
    .then(data => data)
    .catch(err => console.log('error', err))
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === 'getRestaurantNames') {
      const googleApiKey = '';
      let googleRequests = [];
      request.names.forEach((name) => {
        const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${googleApiKey}&inputtype=textquery&locationbias=ipbias&fields=name,rating,user_ratings_total&input=${encodeURIComponent(name)}`;
        googleRequests.push(makeRequest(url));
      });

      Promise.all(googleRequests).then((apiResponses) => {
        const massagedData = apiResponses.map(data => {
          if (data) {
            if (data.candidates.length) {
              return {
                rating: data.candidates[0].rating,
                userRatingCount: data.candidates[0].user_ratings_total
              };
            } else {
              return { error: 'no data' };
            }
          } else {
            return { error: 'parsing undefined' }
          }
        });

        sendResponse({
          api: massagedData
        });
      });

      return true;
    }
  }
);

chrome.webRequest.onCompleted.addListener(
  async function(details) {
    const tab = await getCurrentTab();
    if (tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });
    }
  },
  {
    urls: ["*://*.seamless.com/search*", "*://api-gtm.grubhub.com/restaurants/search*"],
    types: ['xmlhttprequest']
  }
);
