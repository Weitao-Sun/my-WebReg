(async () => {
    const response = await chrome.runtime.sendMessage({target: "options"});
    // do something with response here, not outside the function
    console.log(response);
  })();