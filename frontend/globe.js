// const selected = document.querySelector(".selected");
//
// const optionsContainer = document.querySelector(".options-container");
//
// const optionsList = document.querySelectorAll(".option");
//
//
//
//
// optionsList.forEach(o => {
//     o.addEventListener("click", () => {
//         var val = (o.querySelector("label").innerHTML).replaceAll(' ', '_')
//         selected.innerHTML = o.querySelector("label").innerHTML;
//         selected.setAttribute('value', val)
//         var crit='total_vaccinations'
//         Promise.all([
//             d3.json('./assets/world_countries.json'),
//             d3.json('http://localhost:7070/worldData?criteria=' + crit)
//         ]).then(
//             d => createMap(null, d[0], d[1])
//         );
//
//         optionsContainer.classList.remove("active");
//
//     });
// });

var crit='total_cases'
Promise.all([
    d3.json('./assets/world_countries.json'),
    d3.json('http://localhost:7070/worldData?criteria=' + crit)

]).then(
    d => createMap(null, d[0], d[1])
);


var filter=document.getElementsByClassName("filter")[0]
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
d.style.background="white"

function createMap(error, data, mapCriteria) {
    var myobj=document.getElementsByTagName('svg')[0]
    var elem = document.querySelector("#covid")
    console.log(elem.childNodes.length)
    if (elem.childNodes.length>=1) {
        d3.select("svg").remove();
    }
    const mapCriteriaById = {};
    console.log(data)
    console.log(mapCriteria)
    //console.log(mapCriteria["AFG"].data)
    console.log(Object.keys(mapCriteria))
    Object.keys(mapCriteria).forEach(d => { mapCriteriaById[d] = +mapCriteria[d].data[450]; });
    console.log(mapCriteriaById)
    //data.features.forEach(d => { mapCriteria[d].data = mapCriteriaById[d] });
    const color = d3.scaleThreshold()
        .domain([
            100,
            1000,
            5000,
            10000,
            50000,
            100000,
            500000,
            1000000,
            5000000,
            15000000
        ])
        .range([
            'rgb(247,251,255)',
            'rgb(222,235,247)',
            'rgb(198,219,239)',
            'rgb(158,202,225)',
            'rgb(107,174,214)',
            'rgb(66,146,198)',
            'rgb(33,113,181)',
            'rgb(8,81,156)',
            'rgb(8,48,107)',
            'rgb(3,19,43)'
        ]);
    var width = 800,
        height = 800,
        scale = 300,
        lastX = 0,
        origin = {
            x: 55,
            y: 0
        };

    var svg = d3.select(".rect-d").append('svg')
        .style('width', 1000)
        .style('height', 1000)
        .style("transform", "translate(-1%,-1%)")
        // .style('border', '1px black solid')

    var projection = d3.geoOrthographic()
        .scale(scale)
        .translate([width / 2, height / 2])
        .rotate([origin.x, origin.y])
        .center([0, 0])
        .clipAngle(90);

    var geoPath = d3.geoPath()
        .projection(projection);

    var graticule = d3.geoGraticule();
    var sphere = {type: "Sphere"};

    // setup the gradient to make the earth look brighter at top left
    var gradient = svg.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("fx1", "50%")
        .attr("fy1", "50%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");
    gradient.append("svg:stop") 		// middle step setting
        .attr("offset", "50%")
        .attr("stop-color", "#fff")
        .attr("stop-opacity", 0.6);
    gradient.append("svg:stop") 		// final step setting
        .attr("offset", "100%")
        .attr("stop-color", "#006")
        .attr("stop-opacity", 0.6);
    // end setup gradient


    // zoom AND rotate
    let rotate0, coords0;
    const coords = () => projection.rotate(rotate0)
        .invert([d3.event.x, d3.event.y]);

    svg
        .call(d3.drag()
            .on('start', () => {
                rotate0 = projection.rotate();
                coords0 = coords();
                moving = true;
            })
            .on('drag', () => {
                const coords1 = coords();
                projection.rotate([
                    rotate0[0] + coords1[0] - coords0[0],
                    rotate0[1] + coords1[1] - coords0[1],
                ])
                updatePaths(globe, graticule, geoPath);
            })
            .on('end', () => {
                moving = false;
                updatePaths(globe, graticule, geoPath);
            })
            // Goal: let zoom handle pinch gestures (not working correctly).
            .filter(() => !(d3.event.touches && d3.event.touches.length === 2))
        )

    // code snippet from http://stackoverflow.com/questions/36614251
    // var λ = d3.scaleLinear()
    //     .domain([-width, width])
    //     .range([-180, 180])

    var globe = svg.append('g');

    // Draw the sphere for the earth
    globe.append("path")
        .datum(sphere)
        .attr("class", "sphere")
        .attr("d", geoPath);
    // draw a gradient sphere because it looks cool
    globe.append("path")
        .datum(sphere)
        .attr("class", "gradient")
        .attr("d", geoPath)

    globe.append('path')
        .datum(graticule)
        .attr('class', 'graticule')
        .attr('d', geoPath);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function(world) {

        var countries = topojson.feature(world, world.objects.countries).features;

        // draw country outlines
        globe.selectAll('.country')
            .data(countries)
            .data(data.features)
            .enter()
            .append('path')

            .attr('class', 'country')
            .attr('d', geoPath)
            .style("fill", d => color(mapCriteriaById[d.id]))

    });

//         function zoomed() {
//             var transform = d3.event.transform;
//             var r = {
//                 x: λ(transform.x),
//             };
// //        var k = Math.sqrt(100 / projection.scale());
// //         if (d3.event.sourceEvent.wheelDelta) {
// //           projection.scale(scale * transform.k)
// //           transform.x = lastX;
// //         } else {
//             projection.rotate([origin.x + r.x, 0]);
//             lastX = transform.x;
// //         }
//             updatePaths(globe, graticule, geoPath);
//         };

};

function updatePaths(globe, graticule, geoPath) {
    globe.selectAll('path.graticule').attr('d', geoPath);
    globe.selectAll('path.country').attr('d', geoPath);
};

//createMap(error, data, mapCriteria);
