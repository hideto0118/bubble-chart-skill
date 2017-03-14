(function() {

  var height = window.innerHeight;
  var width = window.innerWidth;

  // var centerY = window.innerHeight / 2;
  // var centerX= window.innerWidth / 2;

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

  var svg = d3.select("#chart")
    .append("svg")
    .attr("height", height)
    .attr("width", width)
    .call(responsivefy)
    .append("g")
    .attr("transform", "translate(0,0)")

  // var defs = svg.append("defs");

  var radiusScale = d3.scaleSqrt().domain([0, 100]).range([10, 60])

  //the simulation is a collentio of forces
  //about where we want our circles to go
  //and how we want our circles to interact
  //STEP ONE: get them to the middle
  //STEP TWO: don't have them collide

  var forceXSeparate = d3.forceX(function(d) {
      if(d.category === 'front'){
        return width / 2 + 450;
      }else if(d.category === 'back'){
        return width / 2 - 450;
      }else{
        return width / 2;
      }
    }).strength(0.052);

  var forceXCombine = d3.forceX(width / 2).strength(0.052);

  var forceY = d3.forceY(height / 2).strength(0.052);

  var forceCollide = d3.forceCollide(function(d) {
      return radiusScale(d.parcent) + 1;
    })

  var simulation = d3.forceSimulation()
    .force("x", forceXCombine)
    .force("y", forceY)
    .force("collide", forceCollide)

  d3.queue()
    .defer(d3.csv, "webskills.csv")
    .await(ready)

  function ready (error, datapoints) {

    var defs = svg.selectAll(".skill-pattern")
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


    // var count = 0;
    // var interval = setInterval(function(){
    //   console.log(count);
    //   ++count;
    //   var body = document.querySelector("body");
    //   if(body.onload == true) {

    // window.onload = function(){
    //   console.log("leaded!");

    // document.addEventListener('DOMContentLoaded', function() {
    //   console.log("leaded!");
    var id;
    var radius;
    var image;
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
      // .on('click', function(d) {
      //   this.setAttribute("style", "transform: scale(1, 1);");
      //   var thisNode = this;
      //   setTimeout(function(){
      //     console.log(thisNode);
      //     thisNode.setAttribute("cx", centerX);
      //     thisNode.setAttribute("cy", centerY);
      //   }, 500);
      //   setTimeout(function(){
      //     console.log(thisNode);
      //     thisNode.setAttribute("style", "transform: scale(4, 4);");
      //   }, 800);
      // })
      .on('mouseover', function(d) {
        var thisNode = this;
        this.setAttribute("style", "transform: scale(2, 2);");
        var skill = document.querySelectorAll(".skill");
        document.querySelector("#js-text").innerHTML = d.skill;
        skill.forEach(function(item) {
          if(thisNode != item){
            item.setAttribute("opacity", "0.1");
          }
        })
      })
      .on('mouseleave', function(d) {
        this.setAttribute("style", "transform: scale(1, 1);");
        document.querySelector("#js-text").innerHTML = "";
        var skill = document.querySelectorAll(".skill");
        skill.forEach(function(item) {
          item.setAttribute("opacity", "1");
        })
      })

      d3.select("#js-separate").on('click', function(){
        simulation
          .force("x", forceXSeparate)
          .alphaTarget(0.4)
          .restart()
      })

      d3.select("#js-combine").on('click', function(){
        simulation
          .force("x", forceXCombine)
          .alphaTarget(0.2)
          .restart()
      })

      simulation.nodes(datapoints)
          .on('tick', ticked)
      // clearInterval(interval);

      function ticked() {
        circles
          .attr("cx", function(d) {
            return d.x
          })
          .attr("cy", function(d) {
            return d.y
          })
      }//ticked
    //   }//if
    // }, 1000);

  // }//onload
  // }, false);//DOMContentLoaded
// },500);
}//ready
})();