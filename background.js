chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    let googleRequests = [];
    request.names.forEach((name) => {
      const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=HIDDEN&inputtype=textquery&locationbias=ipbias&fields=name,rating,user_ratings_total&input=${encodeURIComponent(name)}`;
      googleRequests.push(makeRequest(url));
    });

    Promise.all(googleRequests).then((apiResponses) => {
      const massagedData = apiResponses.map(data => {
        const parsedData = JSON.parse(data);
        if (parsedData.candidates.length) {
          return {
            rating: parsedData.candidates[0].rating,
            userRatingCount: parsedData.candidates[0].user_ratings_total
          };
        } else {
          return { error: 'no data' };
        }
      });

      sendResponse({
        api: massagedData
      });
    });

    return true;
  }
);

makeRequest = (url) => {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
          return resolve(xhr.response);
      } else {
        reject(Error({
          status: xhr.status,
          statusTextInElse: xhr.statusText
        }))
      }
    }
    xhr.onerror = () => {
      reject(Error({
        status: xhr.status,
        statusText: xhr.statusText
      }))
    }
    xhr.send();
  });
}
