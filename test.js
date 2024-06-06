classSchduleForm = new FormData();
classSchduleForm.append("YearTerm", "");
classSchduleForm.append("ShowFinals", "on");
classSchduleForm.append("Breadth", "ANY");
classSchduleForm.append("Dept", "");
classSchduleForm.append("CourseNum", "");
classSchduleForm.append("Division", "ANY");
classSchduleForm.append("CourseCodes", "");
classSchduleForm.append("InstrName", "");
classSchduleForm.append("CourseTitle", "");
classSchduleForm.append("ClassType", "ALL");
classSchduleForm.append("Units", "");
classSchduleForm.append("Modality", "");
classSchduleForm.append("Days", "");
classSchduleForm.append("StartTime", "");
classSchduleForm.append("EndTime", "");
classSchduleForm.append("MaxCap", "");
classSchduleForm.append("FullCourses", "ANY");
classSchduleForm.append("FontSize", "100");
classSchduleForm.append("CancelledCourses", "Exclude");
classSchduleForm.append("Bldg", "");
classSchduleForm.append("Room", "");
classSchduleForm.append("Submit", "Display Web Results");

function getOptions() {
    htmlContent = "";
    console.log("updateOption");
    fetch("https://www.reg.uci.edu/perl/WebSoc", {mode: 'no-cors'}).then(function(response) {
        // When the page is loaded convert it to text
        return response.text();
    }).then(function(html) {
        htmlContent = html;
        //console.log(htmlContent);
        optionsJSON = {};
        quarterRangeStart = new RegExp("<select name=\"YearTerm\">", "g");
        quarterRangeEnd = new RegExp("</select>", "g");
        classRangeStart = new RegExp("<select name=\"Dept\">", "g");
        classRangeEnd = new RegExp("</select>", "g");

        quarterStartIndex = htmlContent.search(quarterRangeStart);
        htmlContent = htmlContent.substring(quarterStartIndex);
        quarterEndIndex = htmlContent.search(quarterRangeEnd);
        quarterHTML = htmlContent.substring(0, quarterEndIndex + 9);
        htmlContent = htmlContent.substring(quarterEndIndex + 9);

        classStartIndex = htmlContent.search(classRangeStart);
        htmlContent = htmlContent.substring(classStartIndex);
        classEndIndex = htmlContent.search(classRangeEnd);
        classHTML = htmlContent.substring(0, classEndIndex + 9);

        // console.log(quarterHTML);
        // console.log(classHTML);

        quarterPattern = new RegExp("<option value=\"[-0-9a-zA-Z]*\" style=\"color: [#0-9a-zA-Z]*\".*</option>", "g");
        quarterMatches = quarterHTML.match(quarterPattern);
        // extract each value and name pair from quarterMatches
        for (let i = 0; i < quarterMatches.length; i++) {
            quarterValuePattern = new RegExp("value=\"[-0-9a-zA-Z]*\"");
            quarterValue = quarterMatches[i].match(quarterValuePattern)[0].split("\"")[1];
            quarterNamePattern = new RegExp(">.*</option>", "g");
            quarterName = quarterMatches[i].match(quarterNamePattern)[0].split(">")[1].split("<")[0];
            optionsJSON[quarterValue] = quarterName;
        }

        classPattern = new RegExp("<option value=\"[- A-Za-z0-9]*\".*</option>", "g");
        classMatches = classHTML.match(classPattern);
        // extract each value and class name pair from classMatches
        for (let i = 0; i < classMatches.length; i++) {
            classValuePattern = new RegExp("value=\"[- A-Za-z0-9]*\"");
            classValue = classMatches[i].match(classValuePattern)[0].split("\"")[1];
            console.log(typeof classValue);
            classNamePattern = new RegExp(">.*</option>", "g");
            className = classMatches[i].match(classNamePattern)[0].split(">")[1].split("<")[0];
            optionsJSON[classValue] = className;
        }

        console.log(optionsJSON);
    }).catch(function(err) {
        console.log('Failed to fetch page: ', err);
    });
}

function getClasses(term = "2024-92", dept = "COMPSCI") {
    classSchduleForm.set("YearTerm", term);
    classSchduleForm.set("Dept", dept);
    fetch("https://www.reg.uci.edu/perl/WebSoc", {
        method: 'POST',
        body: classSchduleForm
    }).then(function(response) {
        // When the page is loaded convert it to text
        return response.text();
    }).then(function(html) {
        // get course title
        courseTitleStart = new RegExp("<td class=\"CourseTitle\".*", "g");
        courseTitleEnd = new RegExp("<tr class=\"blue-bar\".*", "g");
        courseList = [];
        while (html.search(courseTitleStart) != null) {
            courseTitleStartIndex = html.search(courseTitleStart);
            courseTitleEndIndex = html.substring(courseTitleStartIndex).search(courseTitleEnd) + courseTitleStartIndex;
            courseTitle = html.substring(courseTitleStartIndex, courseTitleEndIndex);
            courseCodePattern = new RegExp(">&nbsp;.*&nbsp;.*&nbsp; <font", "g");
            courseCodeMath = courseTitle.match(courseCodePattern);
            if(courseCodeMath == null){break;}
            courseCodeMath = courseCodeMath[0];
            courseCode = courseCodeMath.split(" ")[1] + " " + courseCodeMath.split(" ")[3];
            courseNamePattern = new RegExp("<b>.*</b></font", "g");
            courseName = courseTitle.match(courseNamePattern)[0].split(">")[1].split("<")[0];
            console.log(courseCode, courseName);
            courseInfo = courseTitle.match(new RegExp("nowrap=\"nowrap\">[0-9a-zA-Z-/&]*</td>", "g"));
            console.log(courseInfo);
            courseSections = []
            sectionInfo = []
            for (let i = 0; i < courseInfo.length; i++) {
                sectionInfo.push(courseInfo[i].split(">")[1].split("<")[0]);
                if(sectionInfo.length >= 16){
                    courseSections.push(sectionInfo);
                    sectionInfo = [];
                }
            }
            course = {};
            course["code"] = courseCode;
            course["name"] = courseName;
            course["sections"] = courseSections;
            courseList.push(course);
            html = html.substring(courseTitleEndIndex);
        }
    }).catch(function(err) {
        console.log('Failed to fetch page: ', err);
    });
}

getClasses();