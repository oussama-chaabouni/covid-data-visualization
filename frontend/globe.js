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
    const format = d3.format(',');
    const tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(d => `<strong style='color:red'>Country: </strong><span class='details'>${d.properties.name}<br></span><strong style='color:red'>Value: </strong><span class='details'>${format(mapCriteriaById[d.id])}</span>`);


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

    var step = Math.round(newArray.length / 7)
    var colorRange = []
    var i = 0;

    newArray.forEach((elem, index) => {

        if (index % step === 0) {
            i = i + 1
            colorRange[i] = newArray[index + 1]


        }
        colorRange.length = 7
    })
    colorRange[0] = min
    colorRange[colorRange.length - 1] = max

    const color = d3.scaleThreshold()
        .domain(colorRange)
        .range([
            '#fcfbfd',
            '#efedf5',
            '#dadaeb',
            '#bcbddc',
            '#9e9ac8',
            '#807dba',
            '#6a51a3',
            '#54278f',
            '#3f007d'
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
    svg.call(tip);
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

                .on('mouseover', function (d) {
                    tip.show(d);
                    d3.select(this)
                        .style('opacity', 1)
                        .style('stroke-width', 3);
                })
                .on('mouseout', function (d) {
                    tip.hide(d);
                    d3.select(this)
                        .style('opacity', 0.8)
                        .style('stroke-width', 0.3);
                });

        });
    })


};

function updatePaths(globe, graticule, geoPath) {
    globe.selectAll('path.graticule').attr('d', geoPath);
    globe.selectAll('path.country').attr('d', geoPath);
};
//createMap(error, data, mapCriteria);
//////////////////////////////////////////////////////// d3 Tip ////////////////////////////////////////////////////////

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module with d3 as a dependency.
        define([
            'd3-collection',
            'd3-selection'
        ], factory)
    } else if (typeof module === 'object' && module.exports) {
        /* eslint-disable global-require */
        // CommonJS
        var d3Collection = require('d3-collection'),
            d3Selection = require('d3-selection')
        module.exports = factory(d3Collection, d3Selection)
        /* eslint-enable global-require */
    } else {
        // Browser global.
        var d3 = root.d3
        // eslint-disable-next-line no-param-reassign
        root.d3.tip = factory(d3, d3)
    }
}(this, function (d3Collection, d3Selection) {
    // Public - contructs a new tooltip
    //
    // Returns a tip
    return function () {
        var direction = d3TipDirection,
            offset = d3TipOffset,
            html = d3TipHTML,
            node = initNode(),
            svg = null,
            point = null,
            target = null

        function tip(vis) {
            svg = getSVGNode(vis)
            if (!svg) return
            point = svg.createSVGPoint()
            document.body.appendChild(node)
        }

        // Public - show the tooltip on the screen
        //
        // Returns a tip
        tip.show = function () {
            var args = Array.prototype.slice.call(arguments)
            if (args[args.length - 1] instanceof SVGElement) target = args.pop()

            var content = html.apply(this, args),
                poffset = offset.apply(this, args),
                dir = direction.apply(this, args),
                nodel = getNodeEl(),
                i = directions.length,
                coords,
                scrollTop = document.documentElement.scrollTop ||
                    document.body.scrollTop,
                scrollLeft = document.documentElement.scrollLeft ||
                    document.body.scrollLeft

            nodel.html(content)
                .style('opacity', 1).style('pointer-events', 'all')

            while (i--) nodel.classed(directions[i], false)
            coords = directionCallbacks.get(dir).apply(this)
            nodel.classed(dir, true)
                .style('top', (coords.top + poffset[0]) + scrollTop + 'px')
                .style('left', (coords.left + poffset[1]) + scrollLeft + 'px')

            return tip
        }

        // Public - hide the tooltip
        //
        // Returns a tip
        tip.hide = function () {
            var nodel = getNodeEl()
            nodel.style('opacity', 0).style('pointer-events', 'none')
            return tip
        }

        // Public: Proxy attr calls to the d3 tip container.
        // Sets or gets attribute value.
        //
        // n - name of the attribute
        // v - value of the attribute
        //
        // Returns tip or attribute value
        // eslint-disable-next-line no-unused-vars
        tip.attr = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return getNodeEl().attr(n)
            }

            var args = Array.prototype.slice.call(arguments)
            d3Selection.selection.prototype.attr.apply(getNodeEl(), args)
            return tip
        }

        // Public: Proxy style calls to the d3 tip container.
        // Sets or gets a style value.
        //
        // n - name of the property
        // v - value of the property
        //
        // Returns tip or style property value
        // eslint-disable-next-line no-unused-vars
        tip.style = function (n, v) {
            if (arguments.length < 2 && typeof n === 'string') {
                return getNodeEl().style(n)
            }

            var args = Array.prototype.slice.call(arguments)
            d3Selection.selection.prototype.style.apply(getNodeEl(), args)
            return tip
        }

        // Public: Set or get the direction of the tooltip
        //
        // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
        //     sw(southwest), ne(northeast) or se(southeast)
        //
        // Returns tip or direction
        tip.direction = function (v) {
            if (!arguments.length) return direction
            direction = v == null ? v : functor(v)

            return tip
        }

        // Public: Sets or gets the offset of the tip
        //
        // v - Array of [x, y] offset
        //
        // Returns offset or
        tip.offset = function (v) {
            if (!arguments.length) return offset
            offset = v == null ? v : functor(v)

            return tip
        }

        // Public: sets or gets the html value of the tooltip
        //
        // v - String value of the tip
        //
        // Returns html value or tip
        tip.html = function (v) {
            if (!arguments.length) return html
            html = v == null ? v : functor(v)

            return tip
        }

        // Public: destroys the tooltip and removes it from the DOM
        //
        // Returns a tip
        tip.destroy = function () {
            if (node) {
                getNodeEl().remove()
                node = null
            }
            return tip
        }

        function d3TipDirection() {
            return 'n'
        }

        function d3TipOffset() {
            return [0, 0]
        }

        function d3TipHTML() {
            return ' '
        }

        var directionCallbacks = d3Collection.map({
                n: directionNorth,
                s: directionSouth,
                e: directionEast,
                w: directionWest,
                nw: directionNorthWest,
                ne: directionNorthEast,
                sw: directionSouthWest,
                se: directionSouthEast
            }),
            directions = directionCallbacks.keys()

        function directionNorth() {
            var bbox = getScreenBBox()
            return {
                top: bbox.n.y - node.offsetHeight,
                left: bbox.n.x - node.offsetWidth / 2
            }
        }

        function directionSouth() {
            var bbox = getScreenBBox()
            return {
                top: bbox.s.y,
                left: bbox.s.x - node.offsetWidth / 2
            }
        }

        function directionEast() {
            var bbox = getScreenBBox()
            return {
                top: bbox.e.y - node.offsetHeight / 2,
                left: bbox.e.x
            }
        }

        function directionWest() {
            var bbox = getScreenBBox()
            return {
                top: bbox.w.y - node.offsetHeight / 2,
                left: bbox.w.x - node.offsetWidth
            }
        }

        function directionNorthWest() {
            var bbox = getScreenBBox()
            return {
                top: bbox.nw.y - node.offsetHeight,
                left: bbox.nw.x - node.offsetWidth
            }
        }

        function directionNorthEast() {
            var bbox = getScreenBBox()
            return {
                top: bbox.ne.y - node.offsetHeight,
                left: bbox.ne.x
            }
        }

        function directionSouthWest() {
            var bbox = getScreenBBox()
            return {
                top: bbox.sw.y,
                left: bbox.sw.x - node.offsetWidth
            }
        }

        function directionSouthEast() {
            var bbox = getScreenBBox()
            return {
                top: bbox.se.y,
                left: bbox.se.x
            }
        }

        function initNode() {
            var div = d3Selection.select(document.createElement('div'))
            div
                .style('position', 'absolute')
                .style('top', 0)
                .style('opacity', 0)
                .style('pointer-events', 'none')
                .style('box-sizing', 'border-box')

            return div.node()
        }

        function getSVGNode(element) {
            var svgNode = element.node()
            if (!svgNode) return null
            if (svgNode.tagName.toLowerCase() === 'svg') return svgNode
            return svgNode.ownerSVGElement
        }

        function getNodeEl() {
            if (node == null) {
                node = initNode()
                // re-add node to DOM
                document.body.appendChild(node)
            }
            return d3Selection.select(node)
        }

        // Private - gets the screen coordinates of a shape
        //
        // Given a shape on the screen, will return an SVGPoint for the directions
        // n(north), s(south), e(east), w(west), ne(northeast), se(southeast),
        // nw(northwest), sw(southwest).
        //
        //    +-+-+
        //    |   |
        //    +   +
        //    |   |
        //    +-+-+
        //
        // Returns an Object {n, s, e, w, nw, sw, ne, se}
        function getScreenBBox() {
            var targetel = target || d3Selection.event.target

            while (targetel.getScreenCTM == null && targetel.parentNode == null) {
                targetel = targetel.parentNode
            }

            var bbox = {},
                matrix = targetel.getScreenCTM(),
                tbbox = targetel.getBBox(),
                width = tbbox.width,
                height = tbbox.height,
                x = tbbox.x,
                y = tbbox.y

            point.x = x
            point.y = y
            bbox.nw = point.matrixTransform(matrix)
            point.x += width
            bbox.ne = point.matrixTransform(matrix)
            point.y += height
            bbox.se = point.matrixTransform(matrix)
            point.x -= width
            bbox.sw = point.matrixTransform(matrix)
            point.y -= height / 2
            bbox.w = point.matrixTransform(matrix)
            point.x += width
            bbox.e = point.matrixTransform(matrix)
            point.x -= width / 2
            point.y -= height / 2
            bbox.n = point.matrixTransform(matrix)
            point.y += height
            bbox.s = point.matrixTransform(matrix)

            return bbox
        }

        // Private - replace D3JS 3.X d3.functor() function
        function functor(v) {
            return typeof v === 'function' ? v : function () {
                return v
            }
        }

        return tip
    }
// eslint-disable-next-line semi
}));
