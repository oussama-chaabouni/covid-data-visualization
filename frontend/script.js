const width = 1900;
const height = 950;
const margin = {top: 50, bottom: 250, left: 50, right: 50};
const margin2 = {top: 350, right: 20, bottom: 30, left: 40}
// var bars = renderBarChart()
//         .data(data)
//     .width( 900)
//     .height(500)
//
//
// bars(g)
//
// bars.data(data2)
//     .height(700)
//     .width( 1500)
//
//
//
// bars(g2)


function renderBarChart(title) {
    var data = [];
    var width = 500;
    var height = 300

    var xKey = ''
    var yKey = ''
    var tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([ -10, 0 ])



    var chart = function (id) {
        var d=document.createElement("div");
        // var div=document.createElement("div");
        // div.className="filter"
        // var sp=document.createElement("span");
        // sp.className="filter-data"
        // sp.innerHTML="Filter Data"
        // var div2=document.createElement("div");
        // div2.className="options-container"
        // var div3=document.createElement("div");
        // div3.className="selected"
        // div3.setAttribute('value',"total_cases")
        // div3.innerHTML="Total Cases"
        //
        // div.appendChild(sp).appendChild(div2).appendChild(div3)

        d.className="rect-d"
        filter.style.display="flex"
        document.getElementById("covid").appendChild(d).appendChild(filter)
        d3.select('#' + id).append("h3").text(title.replaceAll("_"," "));
        d.appendChild(document.getElementsByTagName("h3")[0])
        const svg = d3.select(".rect-d")
            .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom + 250)
            .attr("viewBox", [0, 0, width, height + 50])


        var height2 = +svg.attr("height") - margin2.top - margin2.bottom;
        const x = d3.scaleTime()
            .domain(d3.extent(data, (d) => d.date))
            .range([margin.left, width - margin.right])


        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yKey])]).nice()
            .range([height - margin.bottom, margin.top])

        const x2 = d3.scaleTime()
            .domain(x.domain())
            .range([margin.left, width - margin.right])


        const y2 = d3.scaleLinear()
            .domain(y.domain())
            .range([height2, 0])

        var brush = d3.brushX()
            .extent([[50, 0], [width - 50, height2 + 3]])
            .on("brush end", brushed);

        var line = d3.line()
            .x(d => x(d[xKey]))
            .y(d => y(d[yKey] > 0 ? d[yKey] : 0 ))

        var line2 = d3.line()
            .x(d => x2(d[xKey]))
            .y(d => y2(d[yKey] > 0 ? d[yKey] : 0 ))



        svg .append("clipPath")
            .attr("id", "clip")
            .append("rect")

            .attr("width", width-margin.right-margin.left)
            .attr("height", height)
            .attr("x", 50)
            .attr("y", 0);

        var focus = svg.append("g")
            .attr("class", "focus")
       //     .attr("transform", `translate(0,${margin.top - 30})`);

        var  mousemove = function(e) {
            // recover coordinate we need
            focus.selectAll("circle").remove();
            var x0 = x.invert(d3.mouse(this)[0]);
            var i = bisect(data, x0, 1);
            var selectedData = data[i]
            tip.html(function(d) { return  "<strong>Value:</strong> <span style='color:red'>" + selectedData[yKey] + "</span>"; });

            focus.append("circle")
                .attr("cx", x(selectedData[xKey]))
                .attr("cy", y(selectedData[yKey]))
                .attr("r", 3)
                //    .attr("transform", `translate(-18,${margin.top - 30})`)
                .attr("stroke", "steelblue")
                .attr("fill", "#FFF")
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);
        }


        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(0," + margin2.top + ")");

        var bisect = d3.bisector(function(d) { return d[xKey]; }).left;



        focus.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "steelblue")
            .attr("fill", "none")


        focus.append("rect")
            .attr("x",  margin.left)
            .attr("y",  margin.top)
            .attr("width",  width - margin.left - margin.right)
            .attr("height",  height - margin.top - margin.bottom)
            .attr('fill', "transparent")
            .on("mousemove", mousemove)



        svg.call(tip)

        focus.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(60)")
            .style("text-anchor", "start");

        focus.append("g")
            .attr("class", "axis axis--y")
            .call(yAxis);


        context.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line2)
            .attr("stroke", "steelblue")
            .attr("fill", "none");

        context.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height2 + ")")
            .call(xAxis2)
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 40)
            .attr("dy", ".35em")
            .attr("transform", "rotate(60)")

        context.append("g")
            .attr("class", "brush")
            .call(brush)
            .call(brush.move, x.range());

        function brushed() {
            focus.selectAll('circle').remove()
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));

            focus.select(".line").attr("d", line);
            focus.select(".circles").on("mousemove", mousemove);
            focus.select(".axis--x").call(xAxis)

        }

        function yAxis(g) {
            g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .call(g => g.select(".tick:last-of-type text").clone()
                    .attr("text-anchor", "end")
                    .text(data.y))
        }

        function xAxis(g) {
            g.attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x))
                .attr("font-size", '12px')
        }

        function xAxis2(g) {
            g.attr("transform", `translate(0,${height - 180 - margin.bottom})`)
                .call(d3.axisBottom(x2))
                .attr("font-size", '12px')
        }
        svg.node();
    }


    chart.data = function (value) {
        if (!arguments.length) return data;
        data = value
        return chart
    }
    chart.width = function (value) {
        if (!arguments.length) return width;
        width = value
        return chart
    }
    chart.height = function (value) {
        if (!arguments.length) return height;
        height = value
        return chart
    }

    chart.xKey = function (value) {
        if (!arguments.length) return xKey;
        xKey = value
        return chart
    }

    chart.yKey = function (value) {
        if (!arguments.length) return yKey;
        yKey = value
        return chart
    }

    return chart
}

var recentData;
var chosenCtry = ''
var critTab= [];

function selectData(ctry, criterion = "total_cases" ) {
    chosenCtry = ctry;
    var begin = document.getElementById('start').value
    var end = document.getElementById('end').value
    var dimension = document.getElementsByTagName('button').value

    emptyChart();
    d3.json('http://localhost:7070/data?country=' + ctry)
        .then(data => {
            recentData = data.data.map(d => Object.assign({}, d, { date: new Date(d.date )}));


            Object.keys(recentData.filter(word=>word!=="date")).forEach((elem,index)=>{
                // var nextkey = index < Object.keys(recentData).length-1 ? Object.keys(recentData)[index+1] : null;
                    var nextkey = Object.keys(recentData)[index+1]


                    if((nextkey!=null)&&(((Object.keys(recentData[elem]))) !== ((Object.keys((recentData)[nextkey]))))){
                        critTab=Object.keys(recentData[elem])
                    }

                })

            if(critTab.indexOf(criterion)> -1){
            renderBarChart(ctry + ' : ' + criterion)
                .data(recentData)
                .xKey('date')
                .yKey(criterion)
                .width(800)
                .height(500)('covid');
            }else{
                var d=document.createElement("div");
                filter.style.display="flex"
                document.getElementById("covid").appendChild(d).appendChild(filter)

                var myobj = document.getElementById('covid')
                var h = document.createElement("H1")
                h.className="error"

                var t = document.createTextNode("No Data Found");
                h.appendChild(t)

                myobj.appendChild(h);
                myobj.append(rect)
                d3.select(".svg_globe").remove();

            }
        })
        .catch(function(error) {

        });

};

function emptyChart(){
    var myobj = document.getElementById('covid')
    myobj.innerHTML = '';
}
var rect=document.getElementsByClassName('rect-d')[0]
function filterData(begin, end, dimension) {
    emptyChart();

    if(critTab.indexOf(dimension)> -1) {
        renderBarChart(chosenCtry + ' : ' + dimension)
            .data(
                recentData.filter(item => item.date > begin && item.date < end)
                    .map((item) => Object.assign({}, item, {date: new Date(item.date)}))
            )
            .xKey('date')
            .yKey(dimension)
            .width(800)
            .height(500)('covid');
    }else{

        var d=document.createElement("div");
        filter.style.display="flex"
        document.getElementById("covid").appendChild(d).appendChild(filter)

        var myobj = document.getElementById('covid')
        var h = document.createElement("H1")
        h.className="error"

        var t = document.createTextNode("No Data Found");
        h.appendChild(t)

        myobj.appendChild(h);
        myobj.append(rect)
    }
}







/*
function selectCountry(btn,begin,end,y) {

    // var e = document.getElementById("cities");
    // var y = e.value

    console.log(btn)




    d3.json("http://localhost:7070/data?country=" + y)
        .then(data => {
            [btn].filter(item => item !== "date").filter(item => item !== "date").forEach((item) => {
                renderBarChart(y + " : " + item)
                    .data(
                        data
                            .data
                            .filter(item => item.date > begin && item.date < end)
                            .map((item) => Object.assign({}, item, {date: new Date(item.date)}))
                    )
                    .xKey('date')
                    .yKey(item)
                    .width(800)
                    .height(500)("covid");
            })

        })
    var myobj=document.getElementById('covid')
    var elem = document.querySelector("#covid")
    console.log(elem.childNodes.length)
    if (elem.childNodes.length!=0) {
        myobj.innerHTML="";
    }



}*/



/*
Promise.all(["TUN"].map(ctry => d3.json("http://localhost:7070/data?country=" + ctry)
    .then(data => {
        Object.keys(data.data[data.data.length - 1]).filter(item => item !== "date").filter(item => item !== "date").forEach((item) => {
            renderBarChart(ctry + " : " + item)
                .data(
                    data
                        .data
                        .filter(item => item.date > "2020-06-01" && item.date < "2021-08-01")
                        .map((item) => Object.assign({}, item, {date: new Date(item.date)}))
                )
                .xKey('date')
                .yKey(item)
                .width(800)
                .height(500)("covid");
        })

    })))
*/

/*
Promise.all(["FRA", "TUN"].map(ctry => d3.json("http://localhost:7070/data?country="+ ctry)
    .then(data => {
        ["new_deaths"].forEach((item) => {
            renderBarChart(ctry + " : " + item)
                .data(data.data.filter(item => item.date > "2021-05-01" && item.date < "2021-07-01"))
                .xKey('date')
                .yKey(item)
                .width( 5800)
                .height(500)("covid");
        })

    })))
*/


//Object.keys(data.data[data.data.length - 1]).filter(item => item !== "date")
