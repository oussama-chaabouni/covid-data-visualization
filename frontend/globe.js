var obj1 = {}

function loadWorldData(crit) {

    d3.json('http://localhost:7070/worldData').then(data => {
        Object.keys(data).forEach(elem => {
            var len = data[elem].data.length
            for (var i = 0; i < len; i++) {
                obj1[elem] = (data[elem])
                obj1[elem].data[i] = (data[elem].data[i][crit])
            }
        })
        "OWID_AFR OWID_ASI OWID_EUR OWID_EUN OWID_INT OWID_KOS OWID_NAM OWID_CYN OWID_OCE OWID_SAM OWID_WRL".split(" ")
            .forEach(e => delete obj1[e]);
        data = obj1

        createMap(null, data)
    })
}

loadWorldData("total_cases")


var filter = document.getElementsByClassName("filter")[0]
var d = document.createElement("div");


d.className = "rect-d"
filter.style.display = "flex"
document.getElementById("covid").appendChild(d).appendChild(filter)
d.style.background = "white"

function createMap(error, mapCriteria) {
    var d = document.getElementsByClassName('rect-d')[0];
    d.style.background = "white"
    var myobj = document.getElementsByTagName('svg')[0]
    var elem = document.querySelector("#covid")

    if (elem.childNodes.length >= 1) {
        d3.select("svg").remove();
    }
    const mapCriteriaById = {};


    Object.keys(mapCriteria).forEach(d => {
        mapCriteriaById[d] = +mapCriteria[d].data[450];
    });

    //data.features.forEach(d => { mapCriteria[d].data = mapCriteriaById[d] });
    var arr = Object.values(mapCriteriaById);

    const newArray = arr.filter(function (value) {
        return !Number.isNaN(value);
    });

    newArray.sort(function (a, b) {
        return a - b;
    });

    var max = Math.max(...newArray)
    var min = Math.min(...newArray)


    // var tab=[]
    // newArray.reduce(function (sum, value,index) {
    //     return tab[index/((newArray.length)/8)]=((sum + value)/(index+1));
    // }, 0)
    var tab = []


    tab.sort(function (a, b) {
        return a - b;
    });

    var step = Math.round(newArray.length / 8)
    var colorRange = []
    var i = 0;

    newArray.forEach((elem, index) => {

        if (index % step === 0) {
            i = i + 1
            colorRange[i] = newArray[index + 1]


        }
        colorRange.length = 8
    })
    colorRange[0] = min
    colorRange[colorRange.length - 1] = max

    const color = d3.scaleThreshold()
        .domain(colorRange)
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
    var width = 600,
        height = 600,
        scale = 300,
        lastX = 0,
        origin = {
            x: 55,
            y: 0
        };

    var svg = d3.select(".rect-d").append('svg')
        .attr("class", "svg_globe")
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
    gradient.append("svg:stop")        // middle step setting
        .attr("offset", "50%")
        .attr("stop-color", "#fff")
        .attr("stop-opacity", 0.6);
    gradient.append("svg:stop")        // final step setting
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

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(function (world) {

        var countries = topojson.feature(world, world.objects.countries).features;
        d3.json('./assets/world_countries.json').then(data => {


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
    })


};

function updatePaths(globe, graticule, geoPath) {
    globe.selectAll('path.graticule').attr('d', geoPath);
    globe.selectAll('path.country').attr('d', geoPath);
};

//createMap(error, data, mapCriteria);
