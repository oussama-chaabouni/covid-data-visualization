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

app.get('/countries', (request, response) => {
    var readData = fs.readFileSync('data.json' , "utf-8")
    var jsonData=JSON.parse(readData)

    var obj={}
    var keys=Object.keys(jsonData);
    console.log(jsonData[keys[0]].location)

    Object.keys(jsonData).forEach(elem=>{
    //    var objKeys=elem;
    //    var objValues=jsonData[elem].location
        obj[elem]=jsonData[elem].location

    })


   // console.log(obj)

    response.send(obj)
})

app.get('/criteria', (request, response) => {
    var readData = fs.readFileSync('data.json' , "utf-8")
    var jsonData=JSON.parse(readData)


    var critTab=[]
    Object.keys(jsonData["FRA"].data).forEach((elem,index)=>{

        var nextkey = index < Object.keys(jsonData["FRA"].data).length-1 ? Object.keys(jsonData["FRA"].data)[index+1] : null;


        if((nextkey!=null)&&(((Object.keys(jsonData["FRA"].data[elem])).length) < ((Object.keys((jsonData["FRA"].data)[nextkey]).length)))){
           critTab=Object.keys(jsonData["FRA"].data[elem])
       }

    })

    response.send(critTab.filter(item => item !== "date").filter(item => item !== "tests_units"))


    //response.send(Object.keys(jsonData[[params.country]].data[jsonData[params.country].data.length - 1]).filter(item => item !== "date"))
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












