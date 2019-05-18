chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    request.names ? sendResponse({ received: "true"}) : sendResponse({ received: "false"});
  }
);