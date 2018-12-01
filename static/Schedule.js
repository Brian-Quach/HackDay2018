const Scheduler = (function () {

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
        for (i=0; i<courses.length; i++){
            let course = course[i];
            classes.push(course.lectures);
            if (course.tutorials.length != 0) classes.push(courses.tutorials);
            if (course.practicals.length != 0) classes.push(courses.practicals);
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


    let timeTables = {};

    function createSchedules(classes){
        // Does the actual scheduling, return list of valid timetables

        for (i = 0; i < courses.length; i++) {
            let course = courses[i];
            let newTimetable = TimeTable();

            timeTables.push(newTimetable);
        }

    }

    return {
        createSchedules : createSchedules,

        Course : Course,
    }
})();
