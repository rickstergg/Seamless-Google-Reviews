chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    const url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=HIDDEN&inputtype=textquery&locationbias=ipbias&fields=rating,user_ratings_total&input=' + encodeURIComponent(request.names[0]);

    makeRequest(url)
      .then(resp => {
        const parsedJSON = JSON.parse(resp);
        if (parsedJSON.candidates.length) {
          sendResponse({
            name: request.names[0],
            rating: parsedJSON.candidates[0].rating,
            userRatingCount: parsedJSON.candidates[0].user_ratings_total,
          });
        } else {
          sendResponse({
            error: 'no candidates',
          })
        }
       })
      .catch(err => { sendResponse({ err }); })

      return true;
  }
);

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function(){
      if (xhr.status >= 200 && xhr.status < 300){
          return resolve(xhr.response);
      } else {
        reject(Error({
          status: xhr.status,
          statusTextInElse: xhr.statusText
        }))
      }
    }
    xhr.onerror = function(){
      reject(Error({
        status: xhr.status,
        statusText: xhr.statusText
      }))
    }
    xhr.send();
  })
}
