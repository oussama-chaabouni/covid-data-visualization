const querystring = require('querystring');
const schedule = require('node-schedule');
const chart=require('./chart.js');
const fetch = require("node-fetch");
var cors = require('cors')

var app = require('express')();
app.use(cors())
app.set('view engine', 'ejs')


const https = require('https');
const fs = require('fs');



var download2 = function(url, dest, httpResp) {
    try {
        fs.unlinkSync("data.json")
    } catch(err) {
        console.error(err)
    }

    var file = fs.createWriteStream(dest);
    https.get(url, function(response) {
        console.log("start dowload")
        response.pipe(file);
        file.on('finish', function() {
            file.close();
            console.log("finishhhhhhhhhh")
            httpResp.render('./pages', {test: "finish"})
        });
    });
}
//https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json
app.get('/download', (request, response) => {
    // schedule.scheduleJob('35 18 * * *', () => {
    download2(
        'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.json',
        'data.json',
        response
        )
})
app.get('/data', (request, response) => {
    var params = querystring.parse(request.url.split('?')[1]);
    var readData = fs.readFileSync('data.json' , "utf-8")
    var jsonData=JSON.parse(readData)
    response.send(jsonData[params.country])
})







/*
app.get('/chart', (request, response) => {
    var params = querystring.parse(request.url.split('?')[1]);
    var readData = fs.readFileSync('data.json' , "utf-8")
    var jsonData=JSON.parse(readData)

   // chart();

    response.render('pages/index', {test: "test"})



})*/



app.listen(7070)












