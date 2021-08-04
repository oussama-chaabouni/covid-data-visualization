// Promise.all([
//     d3.json('world_g.json'),
//     d3.tsv ('world_population.tsv')
// ]).then(
//     d => ready(null, d[0], d[1])
// );
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
function createMap() {
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
            .enter()
            .append('path')
            .attr('class', 'country')
            .attr('d', geoPath)
            .style("fill", "green")

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

createMap();
