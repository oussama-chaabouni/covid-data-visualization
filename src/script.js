const data = [
    {letter: "A", frequency: .05167},
    {letter: "B", frequency: .01492},
    {letter: "C", frequency: .02782},
    {letter: "D", frequency: .04253},
    {letter: "E", frequency: .12702},
    {letter: "F", frequency: .02288},
    {letter: "G", frequency: .02015},
    {letter: "H", frequency: .06094},
    {letter: "I", frequency: .06966},
    {letter: "J", frequency: .00153},
    {letter: "K", frequency: .00772},
    {letter: "L", frequency: .04025},
    {letter: "M", frequency: .02406},
    {letter: "N", frequency: .06749},
    {letter: "O", frequency: .07507},
    {letter: "P", frequency: .01929},
    {letter: "Q", frequency: .00095},
    {letter: "R", frequency: .05987},
    {letter: "S", frequency: .06327},
    {letter: "T", frequency: .09056},
    {letter: "U", frequency: .02758},
    {letter: "V", frequency: .00978},
    {letter: "W", frequency: .02360},
    {letter: "X", frequency: .00150},
    {letter: "Y", frequency: .01974},
    {letter: "Z", frequency: .00074},
];

const data2 = [
    {letter: "A", frequency: .09167},
    {letter: "B", frequency: .11492},
    {letter: "C", frequency: .02782},
    {letter: "D", frequency: .06253},
    {letter: "E", frequency: .14702},
    {letter: "F", frequency: .02288},
    {letter: "G", frequency: .06015},
    {letter: "H", frequency: .06094},
    {letter: "I", frequency: .07966},
    {letter: "J", frequency: .00153},
    {letter: "K", frequency: .04772},
    {letter: "L", frequency: .04025},
    {letter: "M", frequency: .02406},
    {letter: "N", frequency: .06749},
    {letter: "O", frequency: .07507},
    {letter: "P", frequency: .01929},
    {letter: "Q", frequency: .00095},
    {letter: "R", frequency: .05987},
    {letter: "S", frequency: .06327},
    {letter: "T", frequency: .09056},
    {letter: "U", frequency: .02758},
    {letter: "V", frequency: .00978},
    {letter: "W", frequency: .02360},
    {letter: "X", frequency: .00150},
    {letter: "Y", frequency: .01974},
    {letter: "Z", frequency: .00074},
];

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

    var xKey = ""
    var yKey = ""
    var focusHeight = 100


    var chart = function (id) {
        d3.select('#' + id).append("h3").text(title);
        const svg = d3.select('#' + id)
            .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.top - margin.bottom + 250)
            .attr("viewBox", [0, 0, width, height + 50]);


        var height2 = +svg.attr("height") - margin2.top - margin2.bottom;


        //   const defaultSelection = [x(d3.utcYear.offset(x.domain()[1], -1)), x.range()[1]];


        const x = d3.scaleTime()
            .domain(d3.extent(data, (d) => d.date))                              //data.length=3 /**/ d3.range(data.length):   Returns [0,1,2,3]
            .range([margin.left, width - margin.right])


        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yKey])]).nice()
            .range([height - margin.bottom, margin.top])

        const x2 = d3.scaleTime()
            .domain(x.domain())                              //data.length=3 /**/ d3.range(data.length):   Returns [0,1,2,3]
            .range([margin.left, width - margin.right])


        const y2 = d3.scaleLinear()
            .domain(y.domain())
            .range([height2, 0])

        // var xAxis = d3.axisBottom(x),
        //     xAxis2 = d3.axisBottom(x2),
        //     yAxis = d3.axisLeft(y);


        var brush = d3.brushX()
            .extent([[50, 0], [width - 50, height2 + 3]])
            .on("brush end", brushed);


        var line = d3.line()
            .x(d => x(d[xKey]))
            .y(d => y(d[yKey] > 0 ? d[yKey] : 0 ))

        var line2 = d3.line()
            .x(d => x2(d[xKey]))
            .y(d => y2(d[yKey] > 0 ? d[yKey] : 0 ))



        var g = svg.append("g")


        svg .append("clipPath")
            .attr("id", "clip")
            .append("rect")

            .attr("width", width-margin.right-margin.left)
            .attr("height", height)
            .attr("x", 50)
            .attr("y", 0);

        var focus = svg.append("g")
            .attr("class", "focus")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        var context = svg.append("g")
            .attr("class", "context")
            .attr("transform", "translate(" + margin.left + "," + margin2.top + ")");


        focus.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line)
            .attr("stroke", "steelblue")
            .attr("fill", "none");

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
            .call(brush.move, x.range()); //[x.range()[0] + 200, x.range()[1]]

        function brushed() {
            var s = d3.event.selection || x2.range();
            x.domain(s.map(x2.invert, x2));

            focus.select(".line").attr("d", line);
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
            g.attr("transform", `translate(0,${height + 100 - margin.bottom - 100})`)
                .call(d3.axisBottom(x))
                .attr("font-size", '12px')
        }

        function xAxis2(g) {
            g.attr("transform", `translate(0,${height - 100 - margin.bottom - 80})`)
                .call(d3.axisBottom(x2))
                .attr("font-size", '12px')
        }

        g.node();
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


Promise.all(["TUN", "FRA"].map(ctry => d3.json("http://localhost:7070/data?country=" + ctry)
    .then(data => {
        Object.keys(data.data[data.data.length - 1]).filter(item => item !== "date").forEach((item) => {
            renderBarChart(ctry + " : " + item)
                .data(
                    data
                        .data
                        .filter(item => item.date > "2020-06-01" && item.date < "2021-07-01")
                        .map((item) => Object.assign({}, item, {date: new Date(item.date)}))
                )
                .xKey('date')
                .yKey(item)
                .width(800)
                .height(500)("covid");
        })

    })))


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
