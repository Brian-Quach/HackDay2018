const express = require('express');
const Request = require("request");

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('static'));

const API = "https://cobalt.qas.im/api/1.0/";
const API_KEY = "qGmY3vHjl1POYYfluD3ohsUyRTUzMfEN";

function courseToString(course){
    let out = ""
    out += course.name;
    out += " (" + course.code + ") at ";
    out += course.campus + " in " + course.term;

    return out;
}

function printCourseResults(courses){
    let out = [];
    for (i = 0; i < courses.length; i++) {
        out.push(courseToString(courses[i]));
    }
    return out;
}

app.get('/api/getCourses/:page', function (req, res, next) {
    let url = API;
    url += "courses/";
    url += "?key=" + API_KEY;

    let pgNum = req.params.page;
    let skip = (parseInt(pgNum)-1)*10;

    url += "&skip=" + skip;
        Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.json(printCourseResults(JSON.parse(body)));
    });
});



app.use(function (req, res, next){
    console.log("HTTP request", req.method, req.url, req.body);
    next();
});

app.use(function (req, res, next){
    console.log("HTTP Response", res.statusCode);
    next();
});

const PORT = 3000;
app.listen(PORT, () =>{
    console.log("Started server on port", PORT);
});