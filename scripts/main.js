var curOptions = {};
var curSchedule = {};

const timetables = [
  ['','SWE212','','','','','','','','','',''],
  ['','','','','COMPSCI266','COMPSCI266','','COMPSCI232','COMPSCI232','','',''],
  ['','SWE212','','','','','','','','','',''],
  ['','','','','COMPSCI266','COMPSCI266','','COMPSCI232','COMPSCI232','','',''],
  ['','SWE212','','COMPSCI200S','','','','','','','','']
];
const timetableType = [
  [{index: '1',name: '8:00'}, 1],
  [{index: '2',name: '9:00'}, 1],
  [{index: '3',name: '10:00'}, 1],
  [{index: '4',name: '11:00'}, 1],
  [{index: '5',name: '12:00'}, 1],
  [{index: '6',name: '14:00'}, 1],
  [{index: '7',name: '15:00'}, 1],
  [{index: '8',name: '16:00'}, 1],
  [{index: '9',name: '17:00'}, 1],
  [{index: '10',name: '18:00'}, 1],
  [{index: '11',name: '19:00'}, 1],
  [{index: '12',name: '20:00'}, 1]
];

const week =  ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri'];
const highlightWeek = new Date().getDay();
const styles = {
    Gheight: 50,
    leftHandWidth: 50,
    palette: ['#ff6633', '#eeeeee']
};


function createTabContainer(){
  var tabContainer = document.createElement('div');
  tabContainer.id = "tabContainer";
  tabContainer.style.width = "100%";
  tabContainer.style.height = "100%";
  tabContainerInnerHTMLStr = `
  <ul>
    <li><a href="#listDiv">Course List</a></li>
    <li><a href="#classDiv">Enrolled Class</a></li>
  </ul>`;
  tabContainer.innerHTML = tabContainerInnerHTMLStr;
  document.body.appendChild(tabContainer);
};

function createListDiv(){
  var listDiv = document.createElement('div');
  listDiv.id = "listDiv";
  listDiv.style.width = "100%";
  listDiv.style.height = "100%";
  document.getElementById("tabContainer").appendChild(listDiv);
}

function createClassDiv(){
  var classDiv = document.createElement('div');
  classDiv.id = "classDiv";
  classDiv.style.width = "100%";
  classDiv.style.height = "100%";
  document.getElementById("tabContainer").appendChild(classDiv);

  const timetable = new Timetables({
    el: '#classDiv',
    timetables: timetables,
    week: week,
    timetableType: timetableType,
    highlightWeek: highlightWeek,
    gridOnClick: function (e) {
      alert(e.name + '  ' + e.week +', 第' + e.index + '节课, 课长' + e.length +'节')
      console.log(e)
    },
    styles: styles
});
};

function createOptionSelection(){
  var optionSelection = document.createElement('div');
  optionSelection.id = "optionSelection";
  optionSelection.style.width = "100%";
  optionSelection.style.height = "100%";
  document.getElementById("listDiv").appendChild(optionSelection);

  innerHTMLstr = "<select id='quarterSelect'>";
  for (const [key, value] of Object.entries(curOptions['quarters'])) {
    innerHTMLstr += "<option value='" + key + "'>" + value + "</option>";
  }
  innerHTMLstr += "</select>";
  innerHTMLstr += "<select id='classSelect'>";
  for (const [key, value] of Object.entries(curOptions['classes'])) {
    innerHTMLstr += "<option value='" + key + "'>" + value + "</option>";
  }
  innerHTMLstr += "</select>";
  innerHTMLstr += "<button id='getClassesSubmit'>Submit</button>";
  
  optionSelection.innerHTML = innerHTMLstr;

};


function getClasses(){
  //alert("getClasses");
  var quarterSelect = document.getElementById("quarterSelect");
  var classSelect = document.getElementById("classSelect");
  console.log(quarterSelect.value, classSelect.value);
  (async () => {
    const schedule = await chrome.runtime.sendMessage({target: "schedule", quarter: quarterSelect.value, dept: classSelect.value});
    // do something with response here, not outside the function
    //console.log(response);
    curSchedule = schedule;
    console.log("=========");
    console.log(curSchedule['courses']);
    classes = curSchedule['courses'];
    var classesListDiv = document.createElement('div');
    classesListDiv.id = "classesListDiv";
    classesListDiv.style.width = "100%";
    classesListDiv.style.height = "100%";
    document.getElementById("listDiv").appendChild(classesListDiv);
    classesListDivInnerHTMLStr = "";

    // for each element in classes array
    for (let i = 0; i < classes.length; i++) {
      classesListDivInnerHTMLStr += "<h3>" + classes[i]['code'] + " " + classes[i]['name'] + "</h3>";
      classesListDivInnerHTMLStr += "<div>";
      for (let j = 0; j < classes[i]['sections'].length; j++) {
        classesListDivInnerHTMLStr += "<p> <button class = \"myenrollClass\">Enroll</button>";
        prefix_str = ["Code: "," |Type: ", " |Section: ", " |Units: ", " |Instructor", " |Time: ", " |Final: ",
                      " |Max: ", " |Enr: ", " |WL: "
        ];
        for (let k = 0; k < 9; k++) {
          classesListDivInnerHTMLStr += prefix_str[k] + classes[i]['sections'][j][k] + " ";
        }
        classesListDivInnerHTMLStr += "</p>";
      }
      classesListDivInnerHTMLStr += "</div>";
    }
    classesListDiv.innerHTML = classesListDivInnerHTMLStr;

    var enrollButtons = document.getElementsByClassName("myenrollClass");
    for (let i = 0; i < enrollButtons.length; i++) {
      console.log(enrollButtons[i]);
      enrollButtons[i].addEventListener("click", function(){
        alert("enrolled");
      });
      //enrollButtons[i].addEventListener("click", alert("enrolled"));
    }
  })();


}


function createNewPage(){
  createTabContainer();
  createListDiv();
  createClassDiv();
  createOptionSelection();

  var submitButton = document.getElementById("getClassesSubmit");
  submitButton.addEventListener("click", getClasses);

  $( "#tabContainer" ).tabs();

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
