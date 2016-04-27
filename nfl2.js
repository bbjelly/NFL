var widthScreen = '100%'
var heightScreen = '100%'
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 930 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
var drafts
var years, teams
//needed for legend - decide how many keys should be there
var legendKey = {basic: {"GONE": "#FF3838", "ACT": "lightgreen", "SUS": "black", "UDF": "grey", "OTHER_TEAM": "#536FF1", "other": "gold"},
                class: {"N/A": "gone", "ACT": "act", "OTHER_TEAM": "other_team", "SUS": "sus", "UDF": "udf", "other": "other"},
               text: {"N/A": ["Not Active", 120], "ACT": ["Active", 107], "OTHER_TEAM": ["Other Team", 93], "SUS": ["Suspended", 101], "UDF": ["Unsigned Draft Pick", 106], "other": ["Other",120]} }

        
var initYears = function (data, ddData) {
    //filter the data using team name
    //because of ddslick...
    var filteredD = data.filter(function(d) {
        return d.team ==ddData.selectedData.text
    })
    return filteredD;
}


d3.json('combinedRosterDraft.json', function(data) {
    //
    var selectOptions={}
    for (var i in data){
        selectOptions[data[i].team]=1;
    };
    //make a selection bar by getting the team name from the data
    for (var i in selectOptions){
        $(".teamroster").each(function(){
            var splitNames = i.split(" ");
            var optionVal = splitNames[0];
            if (splitNames[0] == "New" || splitNames[0] == "San") {
                if (splitNames[1] == "York") {
                    optionVal= splitNames[2];
                } else {
                    optionVal= splitNames[1];              
                }
            }
            $(this).append("<option value=" + optionVal + " data-imagesrc='images/" +i+".png'>"+i+"</option>");  
        });
    }
    
     var svg = d3.select("#canvas")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width)
    .append("svg")
        .attr("class", "firstSvg")
        .attr("width", width)//width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "circleGroup")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");
    
    var svg2 = d3.select("#canvas2")
        .attr("width", width)
        .attr("style", "flex:1")
        .append("svg")
       .attr("class", "secondSvg")
        .attr("width", width)//width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("class", "circleGroup2")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    $("#teamNames").ddslick(
    {
        onSelected: function(ddData)
        {
            d3.selectAll(".circleGroup > *").remove();
            drafts = initYears(data, ddData)
            createChart(drafts,svg)
        }
    });
    $("#teamNames2").val("Atlanta")
    $("#teamNames2").ddslick(
    {
        onSelected: function(ddData)
        {
            d3.selectAll(".circleGroup2 > *").remove();
            drafts2 = initYears(data, ddData)
            createChart(drafts2,svg2)
        }
    });
    createLegend()
    
    
});

//MODIFY
function createChart(drafts,svg) {
    drafts.sort(function(a,b) {
        return d3.descending(a.year, b.year) || d3.ascending(a.round, b.round);
    });
    var positionsObject={}
    var objectLength=[];
    var radius = 13;
     drafts.forEach(function(d) {
        d.year =+ d.year
        positionsObject[d.year]=0
        
    })
     
     var nested_data = d3.nest()
            .key(function(d) { return d.year; })
            .key(function(d) { return d.round; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(drafts)
     
    var prev_round = 1;
    var prev_year = 2015;
    var draftPicks = 0; //to locate circles depending on how many picks per round
    var fixedSize = 2; //to have same gap between rounds
    
    var position=function(d){
        if (d.year != prev_year) {
            //reset prev_round to 1 at the beginning of new year
            prev_round = 1;
            draftPicks=0;
        }
        if (d.round != prev_round) {
            draftPicks = 1;
            while (prev_round != d.round) {
                var sum = 0;
                var limit;
                if (prev_round === "N/A") {
                    limit = 7;
                } else {
                    limit = prev_round;
                }
                for (var i = 0; i < limit; i++) {
                    sum += fixedSize;
                }
                positionsObject[d.year]=radius * 3 * (sum-1)+radius*1.8;
                prev_round++;
                if (prev_round > 7) {
                    prev_round = "N/A"
                }
            }
            positionsObject[d.year]+=radius * 3
        } else {
            draftPicks++;
            if (draftPicks === 3) {
                positionsObject[d.year]-=radius*1.8
            } else {
                positionsObject[d.year]+=radius*1.8
            }
        }
        prev_year = d.year;
//        count++;
        return positionsObject[d.year]
    }
    // Set the ranges
    var x = d3.scale.linear().range([0, width])
    
    var yLoc = d3.scale.linear()
        .range([height, 0])
        .domain([d3.min(drafts, function(d) { return d.year; }), d3.max(drafts, function(d) { return d.year; })])
    
    prev_round = 1;
    prev_year = 2015;
    draftPicks = 0;
    
    var yPosition = function(d) {
            if (d.year != prev_year) {
                //reset prev_round to 1 at the beginning of new year
                prev_round = 1;
                draftPicks=0;
            }
            if (d.round != prev_round) {
                draftPicks=0;
            }
            draftPicks++;
            prev_round = d.round;
            prev_year = d.year;
            if (draftPicks > 2) {
                return yLoc(d.year) + radius*1.5
            }
            return yLoc(d.year)
        }
    var y = d3.time.scale()
    .range([height, 0]);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    y.domain([new Date(d3.min(drafts, function(d) { return d.year; }),0,1), new Date(d3.max(drafts, function(d) { return d.year; }),0,1)]);
   var clicked = false;
    
// Add the scatterplot
    var circle = svg.selectAll("dot")
        .data(drafts)
        .enter().append("circle")
       .attr("class", function(d) {
            return legendKey.class[d.status]
        })
        .attr("r", radius)
        .attr("cx", function(d,i) {
             return position(d)
         })
        .attr("cy", function(d) { 
            return yPosition(d);
         })
    .on("mouseover", function(d) {
                var divText = d3.selectAll("body")
                    .append("div")
                    .attr("class", "previewWrap")
                    .attr("width", "200px")
                divText
                    .append("p")
                    .text("Name: " + d.name);
                divText
                    .append("p")
                    .text("School: " + d.school)
                divText
                    .append("p")
                    .text("Round: " + d.round)
            })
         .on("mousemove", function() {
                d3.selectAll(".previewWrap")
                    .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                    .style("left",(d3.mouse(document.body)[0] + 20) + "px");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".previewWrap").remove();
            })
    //mouseclick
    .on("click", function(d) {
        console.log("hello");
    })
    //hover preview
    d3.selectAll(".positionLabel").each(function(d, i) {
        d3.select(this)      
            .on("mouseover", function(d) {
                var divText = d3.selectAll("body")
                    .append("div")
                    .attr("class", "previewWrap")
                    .attr("width", "200px")
                divText
                    .append("p")
                    .text("Name: " + d.name);
                divText
                    .append("p")
                    .text("School: " + d.school)
                divText
                    .append("p")
                    .text("Round: " + d.round)
                if (d3.select(this)[0][0].tagName === "circle") {
                    d3.select(this).style("opacity", ".6")
                }

            })
         .on("mousemove", function() {
                d3.selectAll(".previewWrap")
                    .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                    .style("left",(d3.mouse(document.body)[0] + 20) + "px");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".previewWrap").remove();
                if (d3.select(this)[0][0].tagName === "circle") {
                    d3.select(this).style("opacity", ".4")
                }
            });
    })
    .on("click", function(d) {
        if (!clicked) {
            d3.select(".left-align").append("img")
                .attr("src", "images/players/allenjavorius.png")
                .attr("class", "profile")
            clicked = true;
            d3.select(".left-align").append("p")
                .attr("class", "profile")
                .text(function() {return d.name})
            d3.select(".left-align").append("p")
                .attr("class", "profile")
                .text(function() {return d.school})
            d3.select(".left-align").append("p")
                .attr("class", "profile")
                .text(function() {return d.team})
            
        } else {
            d3.selectAll(".profile").remove();
            clicked = false;
        }
    })
    
    //ADD position label to the circle    
     drafts.forEach(function(d) {
        d.year =+ d.year
        positionsObject[d.year]=0
    })
     
    prev_round = 1;
    prev_year = 2015;
    draftPicks = 0;
    svg.selectAll("dot")
        .data(drafts)
        .enter().append("text")
        .attr("class", "positionLabel")
        .text(function(d) {
        return d.position;
        })
        .attr("x", function(d,i) {
             return position(d)-10
         })
        .attr("y", function(d) { 
            return yPosition(d)+5;
         })
        .on("mouseover", function(d) {
            var divText = d3.selectAll("body")
                .append("div")
                .attr("class", "previewWrap")
                .attr("width", "200px")
            divText
                .append("p")
                .text("Name: " + d.name);
            divText
                .append("p")
                .text("School: " + d.school)
            divText
                .append("p")
                .text("Round: " + d.round)
        })
     .on("mousemove", function() {
            d3.selectAll(".previewWrap")
                .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                .style("left",(d3.mouse(document.body)[0] + 20) + "px");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".previewWrap").remove();
        })
    // Add the Y Axis
    svg.append("g")
        .attr("class", "yAxis")
        .call(yAxis)
        .style("fill", "aliceblue");
    
    //ADD label for X-axis
    var arr = [1,2,3,4,5,6,7];
    var xTicks = svg.append("g")
        .attr("class", "xAxis")
        .attr("transform", "translate(-5,-25)")
    for (var i = 0; i < arr.length; i++) {
        xTicks.append("text")
            .text('R' + arr[i])
            .attr("x", function() {
                var sum = 0;
                for (var j = 0; j < i; j++) {
                    sum += fixedSize;
                }
                    return radius * 3 * (sum)+radius;
            })
    }
}


function createLegend(){
        
    //create legend
    var svgOrig = d3.select("#legend").append("svg")
        .attr("width", "700px") //to keep it below the svg files above
        .attr("height", "75px")
    var legend = svgOrig.append("g")
        .attr("class", "legend")
    var count = 0;
    var clickedDict = {"gone": false, "act": false, "sus": false, "udf": false, "other_team": false, "other": false}
    for (var i in legendKey.class) {
        keys = Object.keys(legendKey.class);
        legend.append("circle")
        .attr("cx", margin.left - 30 +count*legendKey.text[i][1])
        .attr("cy", 30)
        .attr("r", 10)
        .attr("class", legendKey.class[i])
        .on("click", function(d) {
            var classSelect = this.className.baseVal;
            if (clickedDict[classSelect] == false) {
                d3.selectAll("."+classSelect).each(function(d, i) {
                    d3.select(this).style("fill", "#424343");
                })
                clickedDict[classSelect]=true;
            } else { 
                d3.selectAll("."+classSelect).each(function(d, i) {
                    d3.select(this).style("fill", function(d) {
                        return legendKey.basic[d3.select(this).attr("class").toUpperCase()];
                    });
                })
                clickedDict[classSelect]=false;
            }
        })
        legend.append("text")
            .attr("x", margin.left-15 +count *legendKey.text[i][1])
            .attr("y", 35)
            .style("font-family", "sans-serif")
            .style("fill", "white")
            .text(legendKey.text[i][0]);
        count = count+1;
    }
}