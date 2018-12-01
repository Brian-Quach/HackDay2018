const express = require('express');
const Request = require("request");

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('static'));

const API = "https://cobalt.qas.im/api/1.0/";
const API_KEY = "qGmY3vHjl1POYYfluD3ohsUyRTUzMfEN";

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
        res.json(JSON.parse(body));
    });
});

app.get('/api/searchCourses/:page/:search', function (req, res, next) {
    let url = API;
    url += "courses/search?key=" + API_KEY;

    let pgNum = req.params.page;
    let skip = (parseInt(pgNum)-1)*10;
    url += "&skip=" + skip;
    url += "&q=" + req.params.search;

    console.log(url);


    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.json(JSON.parse(body));
    });
});

/**
 * @return {string}
 */
function Query(courseCode, campus, term) {
    return 'code\:"'+courseCode+'" AND campus\:"'+campus+'" AND term\:"'+term+'"';
}
app.get('/api/findCourse/:courseCode/:campus/:term/', function (req, res, next) {
    let url = API;
    url += "courses/filter?";
    url += "key=" + API_KEY;

    let term = (req.params.term).slice(0, 4) + " " + (req.params.term).slice(4);
    url += "&q=" + Query(req.params.courseCode, req.params.campus, term);

    console.log(url);
    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.json(JSON.parse(body));
    });
});

app.get('/api/getCourse/:courseCode/:campus/:term/', function (req, res, next) {
    let url = API;
    url += "courses/filter?";
    url += "key=" + API_KEY;

    let term = (req.params.term).slice(0, 4) + " " + (req.params.term).slice(4);
    url += "&q=" + Query(req.params.courseCode, req.params.campus, term);

    console.log(url);
    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.json(JSON.parse(body));
    });
});

app.get('/api/timetable/:courseCode/:campus/:term/', function (req, res, next) {
    let url = API;
    url += "courses/filter?";
    url += "key=" + API_KEY;

    let term = (req.params.term).slice(0, 4) + " " + (req.params.term).slice(4);
    url += "&q=" + Query(req.params.courseCode, req.params.campus, term);

    console.log(url);
    Request.get(url, (error, response, body) => {
        if(error) {
            return console.dir(error);
        }
        res.json(JSON.parse(body)[0].meeting_sections);
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