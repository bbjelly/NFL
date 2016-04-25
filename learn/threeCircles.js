document.addEventListener("DOMContentLoaded", function(event) { 
  //do work
    var circle = d3.select("svg").selectAll("circle");

    circle.style("fill", "steelblue");
    circle.attr("r", 30);
    circle.attr("cx", function(d,i) {
        return Math.random() * 720;
    });
    
    circle.data([32, 57, 112, 293])
        .enter().append("circle")
            .attr("cy", 60)
            .attr("cx", function(d, i) {return i * 100+30;})
            .attr("r", function(d) {return Math.sqrt(d)});
    
//    circle.attr("r", function(d) {return Math.sqrt(d);})
    test = {}
    
    console.log(typeof test['i'] === 'undefined')
    test['i'] = 1
    console.log(typeof test['i'] === 'undefined')
});
