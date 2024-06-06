var curOptions = {};
var curSchedule = {};

function createNewPage(){
  var newPage = document.createElement('div');
  newPage.id = "newPage";
  newPage.style.width = "100%";
  newPage.style.height = "100%";
  document.body.appendChild(newPage);

  var newDiv = document.createElement('div');
  newDiv.id = "accordion";
  newDiv.innerHTML = `
  <h3>部分 1</h3>
  <div>
    <p>
    Mauris mauris ante, blandit et, ultrices a, suscipit eget, quam. Integer
    ut neque. Vivamus nisi metus, molestie vel, gravida in, condimentum sit
    amet, nunc. Nam a nibh. Donec suscipit eros. Nam mi. Proin viverra leo ut
    odio. Curabitur malesuada. Vestibulum a velit eu ante scelerisque vulputate.
    </p>
  </div>
  <h3>部分 2</h3>
  <div>
    <p>
    Sed non urna. Donec et ante. Phasellus eu ligula. Vestibulum sit amet
    purus. Vivamus hendrerit, dolor at aliquet laoreet, mauris turpis porttitor
    velit, faucibus interdum tellus libero ac justo. Vivamus non quam. In
    suscipit faucibus urna.
    </p>
  </div>
  <h3>部分 3</h3>
  <div>
    <p>
    Nam enim risus, molestie et, porta ac, aliquam ac, risus. Quisque lobortis.
    Phasellus pellentesque purus in massa. Aenean in pede. Phasellus ac libero
    ac tellus pellentesque semper. Sed ac felis. Sed commodo, magna quis
    lacinia ornare, quam ante aliquam nisi, eu iaculis leo purus venenatis dui.
    </p>
    <ul>
      <li>List item one</li>
      <li>List item two</li>
      <li>List item three</li>
    </ul>
  </div>
  <h3>部分 4</h3>
  <div>
    <p>
    Cras dictum. Pellentesque habitant morbi tristique senectus et netus
    et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in
    faucibus orci luctus et ultrices posuere cubilia Curae; Aenean lacinia
    mauris vel est.
    </p>
    <p>
    Suspendisse eu nisl. Nullam ut libero. Integer dignissim consequat lectus.
    Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
    inceptos himenaeos.
    </p>
  </div>
  `;
  newPage.appendChild(newDiv);
  $("#accordion").accordion();
}

function init(){
  (async () => {
    const options = await chrome.runtime.sendMessage({target: "options"});
    // do something with response here, not outside the function
    //console.log(response);
    curOptions = options;

    const schedule = await chrome.runtime.sendMessage({target: "schedule"});
    // do something with response here, not outside the function
    //console.log(response);
    curSchedule = schedule;

    console.log(curOptions, curSchedule);

    createNewPage();

  })();
};

init();
