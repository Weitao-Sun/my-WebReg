chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("Get request",request);
    if (request.target === "options") {
        console.log("updateOption");
        fetch("https://www.reg.uci.edu/perl/WebSoc", {mode: 'no-cors'}).then(function(response) {
            // When the page is loaded convert it to text
            return response.text();
        }).then(function(html) {
            sendResponse(html);
        }).catch(function(err) {
            console.log('Failed to fetch page: ', err);
        });
        return true;
    }
});
