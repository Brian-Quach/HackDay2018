
function send(method, url, data, callback){
    let xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status !== 200) callback("[" + xhr.status + "] " + xhr.responseText, null);
        else callback(null, JSON.parse(xhr.responseText));
    };
    xhr.open(method, url, true);
    if (!data) xhr.send();
    else{
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
    }
}

function TimeTable(){
    this.TimeSlots = Array(120).fill(true);
    this.CourseSelection = [];
    this.isValid = true;

    this.isFree = function(timeSlot){
        return this.TimeSlots[timeSlot];
    };

    this.addClass = function(classSession){
        //ClassSession is a Class() object
        this.CourseSelection.push(classSession);

        for (let time=classSession.start ; time < classSession.end ; time++){
            this.TimeSlots[time] = false;
        }

    }
}

function getSlotIndex(day, hour){
    // Convert timeslot to weekIndex
    //Out of range
    if (day > 5 || day < 1 || hour < 0 || hour > 23){
        return null;
    }
    return ((day-1)*24) + hour;
}


function Course(code, campus, term){
    this.code = code;
    this.campus = campus;
    this.term = term;
    this.lectures = [];
    this.tutorials = [];
    this.practicals = [];

    this.addLecture = function(lec){
        this.lectures.push(lec);
    };

    this.addTutorial = function(tut){
        this.tutorials.push(tut);
    };

    this.addPractical = function(prac){
        this.practicals.push(prac);
    };
}

function splitCourses(courses){
    // In: List of Course() objects
    // Out: List of Class() objects

    let classes = [];
    for (let i=0; i<courses.length; i++){
        let course = courses[i];
        classes.push(course.lectures);
        if (course.tutorials.length !== 0) classes.push(course.tutorials);
        if (course.practicals.length !== 0) classes.push(course.practicals);
    }

    return classes;
}

function Class(courseCode, sessionCode, start, end){
    // Calling class but also gonna be used to represent filled timeslots
    this.courseCode = courseCode;
    this.sessionCode = sessionCode;
    this.start = end;
    this.end = end;
}


function courseToString(course){
    let out = "";
    out += course.name;
    out += " (" + course.code + ") at ";
    out += course.campus + " in " + course.term;

    return out;
}

function printCourseResults(courses){
    // Makes printing less ugly
    let out = {};
    for (i = 0; i < courses.length; i++) {
        out[courses[i].id] = courseToString(courses[i]);
    }
    return out;
}


function getCourses(page=1, search=""){
    return new Promise((resolve, reject) =>{
            if (search === ""){
                send("GET", "/api/getCourses/"+page, null, function(err, result){
                    resolve(result);
                })
            } else {
                send("GET", "/api/searchCourses/"+page+'/'+search, null, function(err, result){
                    resolve(result);
                })
            }

        }
    )
}

const DAY_MAP = {
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5
}

function parseCourses(courses){
    for (let i = 0 ; i < courses.length; i++){
        let newCourse = new Course(courses[i].code, courses[i].campus, courses[i].term);
        console.log(courses[i].meeting_sections.length);
        for (let j = 0 ; j < courses[i].meeting_sections.length; j++){
            let section = courses[i].meeting_sections[j];
            let sectionCode = section.code;

            let start = [];
            let end = [];
            for (let k = 0; k < section.length; k++){
                console.log("DAYYYY");
                console.log(DAY_MAP[section.day]);
                console.log(section.start/3600);
                start.push(getSlotIndex(DAY_MAP[section.day] ,section.start/3600));
                end.push(getSlotIndex(DAY_MAP[section.day] ,section.end/3600));
            }

            let meeting = new Class(courses[i].code, sectionCode, start, end);

            if (sectionCode.charAt(0) === "L"){
                newCourse.addLecture(meeting);
            } else if (sectionCode.charAt(0) === "T"){
                newCourse.addTutorial(meeting);
            } else if (sectionCode.charAt(0) === "P"){
                newCourse.addPractical(meeting);

            }
        }
        //console.log(JSON.stringify(newCourse));
    }
}






let timeTables = [];

function getAllTimetables(classes){
    // classes - [{session1, session2....}]
    // Does the actual scheduling, return list of valid timetables
    for (let i = 0; i < classes.length; i++) {
        if (i === 0){
            // Create new timetables b/c none exist
            for (let j =0; j < classes[0].length; j++){
                let newTimeTable = new TimeTable();
                newTimeTable.addClass(classes[0][j]);
                timeTables.push(newTimeTable);
            }
        } else {
            let oldLen = timeTables.length;
            timeTables = repeatArray(timeTables, classes[i]);
            for (let j =0; j < classes[i].length; j++){
                for (let k=j*oldLen; k<(j+1)*oldLen; k++){
                    if (timeTables[k].isValid){
                        for (let tslot = classes[i][j].start; tslot < classes[i][j].end; tslot++){
                            if (!timeTables[k].isFree(tslot)){
                                timeTables[k].isValid = false;
                            }
                        }
                        if (timeTables[k].isValid){
                            timeTables[k].addClass(classes[i][j]);
                        }
                    }
                }
            }

            // Remove invalid crap
            for (let i = timeTables.length-1; i >= 0; i--) {
                if (!timeTables.isValid) {
                    timeTables.splice(i, 1);
                }
            }
        }
    }
}


function repeatArray(array, n){
    let out = [];
    for(let i = 0; i < n; i++) {
        out = out.concat(array);
    }
    return out;
}

let pageIndex = 1;

let currentResults = [];

async function displaySearchResults(index){
    let query = document.getElementById("courseSearchQuery").value;
    let output = await getCourses(index, query);
    console.log(output);
    currentResults = [];
    currentResults = parseCourses(output);
    output = JSON.stringify(output);
    if (output === {}){
        pageIndex = pageIndex -1;
        displaySearchResults(pageIndex);
    } else {
        document.getElementById("courseSearch").innerText = JSON.stringify(printCourseResults(JSON.parse(output)))  ;
    }
}

document.getElementById("searchGo").addEventListener("click", function(){
    pageIndex = 1;
    displaySearchResults(pageIndex);
});

document.getElementById("resultsNext").addEventListener("click", function(){
    pageIndex = pageIndex + 1;
    displaySearchResults(pageIndex);
});

document.getElementById("resultsPrev").addEventListener("click", function(){
    if (pageIndex !== 1) pageIndex = pageIndex -1;
    displaySearchResults(pageIndex);
});