(function() {
  var height = 600;
  var width = 1000;

  function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type,
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
  }

// d3.select("#viz").append("svg")
//     .attr("width", 960)
//     .attr("height", 500)
//     .call(responsivefy);

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(0,0)")

  var defs = svg.append("defs");
  defs.append("pattern")
    .attr("id", "js")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("patternContentUnits", "objectBoundingBox")
    .append("image")
    .attr("height", 1)
    .attr("width", 1)
    .attr("preserveAspectRation", "none")
    .attr("xmls:xlink", "http://www.w3.org/1999/xlink")
    .attr("xlink:href", "img/js.png");

  var radiusScale = d3.scaleSqrt().domain([0, 100]).range([10, 60])

  //the simulation is a collentio of forces
  //about where we want our circles to go
  //and how we want our circles to interact
  //STEP ONE: get them to the middle
  //STEP TWO: don't have them collide

  var simulation = d3.forceSimulation()
    .force("x", d3.forceX(width / 2).strength(0.05))
    .force("y", d3.forceY(height / 2).strength(0.05))
    .force("collide", d3.forceCollide(function(d) {
      return radiusScale(d.parcent) + 1;
    }))

  d3.queue()
    .defer(d3.csv, "webskills.csv")
    .await(ready)

  function ready (error, datapoints) {

    defs.selectAll(".skill-pattern")
      .data(datapoints)
      .enter().append("pattern")
      .attr("class", "skill-pattern")
      .attr("id", function(d){
        return d.id;
      })
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("patternContentUnits", "objectBoundingBox")
      .append("image")
      .attr("height", 1)
      .attr("width", 1)
      .attr("preserveAspectRation", "none")
      .attr("xmls:xlink", "http://www.w3.org/1999/xlink")
      .attr("xlink:href", function(d) {
        return "img/" + d.image;
      });

    var circles = svg.selectAll(".skill")
      .data(datapoints)
      .enter().append("circle")
      .attr("class", "skill")
      .attr("r", function(d) {
        return radiusScale(d.parcent);
      })
      .attr("fill", function(d) {
        return "url(#" + d.id + ")"
      })
      .on('click', function(d) {
        console.log(d);
      })


    simulation.nodes(datapoints)
      .on('tick', ticked)

    function ticked() {
      circles
        .attr("cx", function(d) {
          return d.x
        })
        .attr("cy", function(d) {
          return d.y
        })
    }

  }

})();