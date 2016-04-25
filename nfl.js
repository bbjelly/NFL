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

        
var initYears = function (data, selectoption) {
    //filter the data using team name
    var filteredD = data.filter(function(d) {
        var splitNames = d.team.split(" ")
        if (splitNames[0] == "New") {
            if (splitNames[1] == "York") {
                return splitNames[2] == $(selectoption).val()
            } else {
                return splitNames[1] == $(selectoption).val()                
            }
        } else if (splitNames[0] == "San") {
            return splitNames[1] == $(selectoption).val() 
        } else {
            return d.team.split(" ")[0] ==$(selectoption).val()            
        }
    })
    return filteredD;
    //if need nested data v
//    var nested_data = d3.nest()
//    .key(function(d) { return d.year; })
//    .entries(filteredD);
//    return nested_data;
}


d3.json('combinedRosterDraft.json', function(data) {
    //
    var selectOptions={}
    for (var i in data){
        selectOptions[data[i].team]=1;
    };
    for (var i in legendKey.class) {
        d3.select("#positionCheck").append("input")
            .attr("type", "checkbox")
            .attr("id", legendKey.class[i]+"_Check")
            .attr("checked", "true")
    }
    //make a selection bar by getting the team name from the data
    for (var i in selectOptions){
        $("select").each(function(){
            var splitNames = i.split(" ");
            if (splitNames[0] == "New") {
                if (splitNames[1] == "York") {
                    $(this).append("<option value=" + splitNames[2] + ">"+i+"</option>");
                } else {
                    $(this).append("<option value=" + splitNames[1] + ">"+i+"</option>");              
                }                
            } else if (splitNames[0] == "San") {
                $(this).append("<option value=" + splitNames[1] + ">"+i+"</option>");

            } else {     
                $(this).append("<option value=" + i + ">"+i+"</option>");     
            }
        });
    }
//    for (var i=0; i < selectOptions.length;i++) {
//        $("select").each(function(){
//            $(this).append("<option value=" + i + ">"+i+"</option>")});        
//    }
    
    drafts = initYears(data,"#teamNames")
    drafts2 = initYears(data,"#teamNames2")
    
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

    createChart(drafts,svg)
    createChart(drafts,svg2)
    createLegend()
    
    d3.select("#teamNames")
        .on("change", function() {
        d3.selectAll(".circleGroup > *").remove()//.empty();
        drafts = initYears(data,"#teamNames")
        d3.select("#logo1").select("img").remove();
        d3.select("#logo1").append("img")
            .attr("src", "images/"+drafts[0].team +".png");
        createChart(drafts,svg)
    })
    d3.select("#teamNames2")
        .on("change", function() {
         d3.selectAll(".circleGroup2 > *").remove()//empty();
        drafts2 = initYears(data,"#teamNames2");
        d3.select("#logo2").select("img").remove();
        d3.select("#logo2").append("img")
            .attr("src", "images/"+drafts2[0].team +".png");
        createChart(drafts2, svg2)
    })
    
    
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
            .key(function(d) { return d.round; })
            .key(function(d) { return d.year; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(drafts)
     var max_picks = []// d3.map(nested_data, function(d) {
//         return d3.max(d.values,function(k){return k.values});
//     });
//    nested_data.forEach(
//         function(d){
//             console.log(d3.max(d.values,function(k){return k.values}));
//         })
    
    for (var i = 0; i < nested_data.length; i++) {
        max_picks.push(d3.max(nested_data[i].values,function(k){return k.values}));
    }
     
//    console.log(nested_data[2014][1])
    var prev_round = 1;
    var prev_year = 2015;
    var draftPicks = 0;
//    var stDate = 2006;
    //nested_data[parseInt(d.year, 10)-stDate]["values"][prev_round-1]["values"]
    //when prev_round = 1
    var position=function(d){
        if (d.year != prev_year) {
            //reset prev_round to 1 at the beginning of new year
            prev_round = 1;
        }
        if (d.round != prev_round) {
            draftPicks = 0;
            while (prev_round != d.round) {
                var sum = 0;
                var limit;
                if (prev_round === "N/A") {
                    limit = 7;
                } else {
                    limit = prev_round;
                }
                for (var i = 0; i < limit; i++) {
                    sum += max_picks[i];
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
            if (draftPicks == 3) {
                positionsObject[d.year]-=radius*.9
            } else {
                positionsObject[d.year]+=radius*1.8
            }
        }
        prev_year = d.year;
//        count++;
        return positionsObject[d.year]
    }
    // Set the ranges
    var x = d3.scale.linear().range([0, width])//.domain();
    //is there anyway to converge yLoc and y??
    //the problem is I need the y to be in time scale
    //but if I do that, the cy becomes too big and doesn't show up in the graph
    var yLoc = d3.scale.linear()
        .range([height, 0])
        .domain([d3.min(drafts, function(d) { return d.year; }), d3.max(drafts, function(d) { return d.year; })])
    var y = d3.time.scale()
    .range([height, 0]);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left")//.tickFormat(d3.time.years);
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
            return yLoc(d.year);
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
                if (d3.select(this)[0][0].tagName === "circle") {
//                    d3.select(this).style("opacity", ".6")
                }

            })
         .on("mousemove", function() {
                d3.selectAll(".previewWrap")
                    .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                    .style("left",(d3.mouse(document.body)[0] + 20) + "px");
            })
            .on("mouseout", function(d) {
                d3.selectAll(".previewWrap").remove();
//                if (d3.select(this)[0][0].tagName === "circle") {
//                    d3.select(this).style("opacity", ".4")
//                }
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
            return yLoc(d.year)+5;
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
                    sum += max_picks[j];
                }
                    return radius * 3 * (sum)+radius;
            })
//            .attr("y", )
    }
    
    //checkboxes??
    for (var i in legendKey.class) {
        d3.select("#"+legendKey.class[i]+"_Check").on("change", function(){
            var classSelect;
            if (this.id == "other_Check") {
                classSelect = ".other_team"
            } else {
                classSelect ="."+this.id.split("_")[0];
            }
            if (this.checked == false) {
                d3.selectAll(classSelect).each(function(d, i) {
                    d3.select(this).style("fill", "#424343");
                })        
            } else { 
                d3.selectAll(classSelect).each(function(d, i) {
                    d3.select(this).style("fill", function(d) {
                        return legendKey.basic[d3.select(this).attr("class").toUpperCase()];
                    });
                })   
            }
        })
    }
    
    //HOVER for text... is there a better way??
//    svg.selectAll(".positionLabel")
//    //hover preview
//        .on("mouseover", function(d) {
//            var divText = d3.selectAll("body")
//                .append("div")
//                .attr("class", "previewWrap")
//                .attr("width", "200px")
//            divText
//                .append("p")
//                .text("Name: " + d.name);
//            divText
//                .append("p")
//                .text("School: " + d.school)
//            divText
//                .append("p")
//                .text("Round: " + d.round)
//        })
//     .on("mousemove", function() {
//            d3.selectAll(".previewWrap")
//                .style("top",(d3.mouse(document.body)[1] + 40) + "px")
//                .style("left",(d3.mouse(document.body)[0] + 20) + "px");
//        })
//        .on("mouseout", function(d) {
//            d3.selectAll(".previewWrap").remove();
//    });

}


function createLegend(){
        
    //create legend
    var svgOrig = d3.select("#legend").append("svg")
        .attr("width", "700px") //to keep it below the svg files above
        .attr("height", "75px")
    var legend = svgOrig.append("g")
        .attr("class", "legend")
//        .attr("transform", 
//              "translate(" + margin.left * 5 + "," + margin.top + ")")
//        .attr("height", 100)
//        .attr("width", 100);
//    legend.append("text")
//        .attr("x", margin.left-15)
//        .attr("y", margin.top - 15)
//        .style("font-family", "sans-serif")
//        .text("LEGEND KEYS")
//    for (var i = 0; i < Object.keys(legendKey.class).length; i++) {
    var count = 0;
    for (var i in legendKey.class) {
        keys = Object.keys(legendKey.class);
        legend.append("circle")
        .attr("cx", margin.left - 30 +count*legendKey.text[i][1])
        .attr("cy", margin.top+15 - 10)
        .attr("r", 10)
        .attr("class", legendKey.class[i])
        legend.append("text")
            .attr("x", margin.left-15 +count *legendKey.text[i][1])
            .attr("y", margin.top+15 + 0 * 25)
            .style("font-family", "sans-serif")
            .style("fill", "white")
            .text(legendKey.text[i][0]);
        count = count+1;
    }
}

//should i change my nfldraft to have team{year{data corresponding to it}}
//do circles or div??
//what MODE = 'each