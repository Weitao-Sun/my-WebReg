(async () => {
    const response = await chrome.runtime.sendMessage({target: "options"});
    // do something with response here, not outside the function
    console.log(response);
  })();

  (async () => {
    const response = await chrome.runtime.sendMessage({target: "schedule"});
    // do something with response here, not outside the function
    console.log(response);
  })();