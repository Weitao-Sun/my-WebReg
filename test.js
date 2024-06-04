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

getOptions();