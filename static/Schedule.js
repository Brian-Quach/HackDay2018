
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


const Weekdays = {
    "MON" : 1,
    "TUE" : 2,
    "WED" : 3,
    "THU" : 4,
    "FRI" : 5
};


function TimeTable(){
    this.TimeSlots = Array(120).fill(true);
    this.CourseSelection = [];

    this.isFree = function(timeSlot){
        return this.TimeSlots[timeSlot];
    };
}

function getSlotIndex(day, hour){
    // Convert timeslot to weekIndex
    //Out of range
    if (day > 5 || day < 1 || hour < 0 || hour > 23){
        return null;
    }
    return ((day-1)*24) + hour;
}


function Course(code){
    this.code = code;
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
    this.start = start;
    this.end = end;
    this.duration = end-start;
}

let coursesSelected = [];

let timeTables = {};

function getAllTimetables(classes){
    // classes - [{session1, session2....}]
    // Does the actual scheduling, return list of valid timetables
    for (let i = 0; i < classes.length; i++) {
        if (i === 0){

        }
    }
}
