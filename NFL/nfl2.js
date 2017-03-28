var widthScreen = '100%'
var heightScreen = '100%'
var margin = {top: 50, right: 20, bottom: 30, left: 70},
    width = 710 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;
var drafts, mouseClickDrafts1, mouseClickDrafts2;
var clickedDict = {"gone": false, "act": false, "sus": false, "udf": false, "other_team": false, "other": false}

//REALLY BAD... WANT TO FIX LATER
var mcDraftsWrap = {first: mouseClickDrafts1, second: mouseClickDrafts2}
var years, teams
//needed for legend - decide how many keys should be there
var legendKey = {basic: {"GONE": "#FF3838", "ACT": "lightgreen", "SUS": "#D7D6D6", "UDF": "grey", "OTHER_TEAM": "#A2AFEF", "other": "gold"},
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

var filterByTeamName = function(data, teamName) {
    
    var dataFilteredByTeam = data.filter(function(d) {
        return d.team ==teamName
    })
    return dataFilteredByTeam;
}
// Filter by names of players in drafts
var initMouseClickDraft = function(data, draft) {
    var filteredD = data.filter(function(d) {
        var isName = false;
        var names = d.name.split(" ")
        var name = names[1] + ", " +names[0]
        for (var i = 0; i < draft.length; i++) {
            isName = name ==draft[i].name
            if (isName) {
                break;
            }
        }
        return isName;
    })
    return filteredD;
}
var initJson = function (draft, keyMC, svg, identifier) {
    d3.json('playerProfileAll.json', function(data) {
        mcDraftsWrap[keyMC] = initMouseClickDraft(data, draft);
        mouseClick(svg, mcDraftsWrap[keyMC], "#clickProf"+identifier, draft);
    });
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

     var svgHolder = d3.select("body").append("div")
        .attr("id", "SvgHolder")
        .attr("height", height + margin.top + margin.bottom)
        .attr("width", width)
    
     for (var i = 0; i < Object.keys(selectOptions).length; i++) {
         var teamName = Object.keys(selectOptions)[i]
         var svg = svgHolder.append("svg")
                .attr("class", "Svg" + i)
                .attr("width", width/4)//width + margin.left + margin.right)
                .attr("height", (height + margin.top + margin.bottom)/4)
                .append("g")
                .attr("class", "circleGroup")
                .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
         displayChart(data, teamName, svg)
     }
    
    

//    var ddData1;
//
//    // TODO: make a function for comboboxes
//    $("#teamNames").ddslick(
//    {
//        onSelected: function(ddData)
//        {
//            ddData1=ddData;
//            d3.selectAll(".circleGroup > *").remove();
//            drafts = initYears(data, ddData)
//            createChart(drafts,svg)
//            d3.selectAll("#clickProf1 > *").remove();
//            initJson(drafts, "first", svg, 1);
//            for (i = 0; i < Object.keys(clickedDict).length; i++) {
//                var key = Object.keys(clickedDict)[i];
//                if (clickedDict[key] == true) {
//                    d3.selectAll("."+key).each(function(d, i) {
//                        d3.select(this).style("fill", function(d) {
//                            return legendKey.basic[d3.select(this).attr("class").toUpperCase()];
//                        });
//                    })
//                    clickedDict[key]=false;
//                }
//            }
//
//        },
//        background: "#676767"
//    });
//    $("#teamNames2").val("Atlanta")
//    $("#teamNames2").ddslick(
//    {
//        onSelected: function(ddData)
//        {
//            d3.selectAll(".circleGroup2 > *").remove();
//            drafts2 = initYears(data, ddData)
//            createChart(drafts2,svg2)
//            initJson(drafts2, "second", svg2, 2);
//            d3.selectAll("#clickProf2 > *").remove();
//            for (i = 0; i < Object.keys(clickedDict).length; i++) {
//                var key = Object.keys(clickedDict)[i];
//                if (clickedDict[key] == true) {
//                    d3.selectAll("."+key).each(function(d, i) {
//                        d3.select(this).style("fill", function(d) {
//                            return legendKey.basic[d3.select(this).attr("class").toUpperCase()];
//                        });
//                    })
//                    clickedDict[key]=false;
//                }
//            }
//
//        },
//        background: "#fff"
//    });
    createLegend()


});

// For displaying all of the charts for all of the teams
function displayChart(data, teamName, svg) {
    draftsFilteredByTeamName = filterByTeamName(data, teamName)
    createChart(draftsFilteredByTeamName, svg)
}
//MODIFY
function createChart(drafts,svg) {
    drafts.sort(function(a,b) {
        return d3.descending(a.year, b.year) || d3.ascending(a.round, b.round);
    });
    var positionsObject={}
    var objectLength=[];
    var radius = 5;
     drafts.forEach(function(d) {
        d.year =+ d.year
        positionsObject[d.year]=0

    })

     var nested_data = d3.nest()
            .key(function(d) { return d.year; })
            .key(function(d) { return d.round; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(drafts)

    var prev_round = 1; // used to change the start location of the circles depending on the round
    var prev_year = 2016; //one that should be most recent year
    var draftPicks; //to locate circles depending on how many picks per round
    var fixedSize = 1.6; //to have same gap between rounds
    var posArr = nested_data.filter(function(nd) {
            return nd.key == prev_year;
        })[0].values.filter(function(nd) {
            return nd.key == prev_round;
        });

    var position=function(d){
        if (d.year != prev_year) {
            //reset prev_round to 0 at the beginning of new year
            prev_round = 0;
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.year;
            })[0].values.filter(function(nd) {
            return nd.key == prev_round;
            });
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
            posArr = nested_data.filter(function(nd) {
                return nd.key == d.year;
            })[0].values.filter(function(nd) {
            return nd.key == d.round;
            });
            positionsObject[d.year]+=radius * 3
            if (posArr[0].values === 1) {
                positionsObject[d.year] += radius*.85
            }
        } else {
            draftPicks++;
            if (draftPicks === 3) {
                if (posArr[0].values == 3 || posArr[0].values == 5) {
                    positionsObject[d.year] -= radius*.9;
                } else {
                    positionsObject[d.year]-=radius*1.8;
                }
            } else if (posArr[0].values == 5 && draftPicks == 4) {
                positionsObject[d.year] -=radius*.9;
            } else {
                positionsObject[d.year]+=radius*1.8
            }
        }
        prev_year = d.year;
        return positionsObject[d.year]
    }
    // Set the ranges
    var x = d3.scale.linear().range([0, width])
    
    var YLOC_SCALE = 1.4
    var yLoc = d3.scale.linear()
        .range([height/YLOC_SCALE, 0])
        .domain([d3.min(drafts, function(d) { return d.year; }), d3.max(drafts, function(d) { return d.year; })])

    var yPosition = function(d) {
            if (d.year != prev_year) {
                //reset prev_round to 1 at the beginning of new year
                prev_round = 1;
                posArr = nested_data.filter(function(nd) {
                    return nd.key == d.year;
                })[0].values.filter(function(nd) {
                    return nd.key == prev_round;
                });
                draftPicks=0;
            }
            if (d.round != prev_round) {
                draftPicks=0;
                posArr = nested_data.filter(function(nd) {
                    return nd.key == d.year;
                })[0].values.filter(function(nd) {
                    return nd.key == d.round;
                });
            }
            draftPicks++;
            prev_round = d.round;
            prev_year = d.year;
            if (draftPicks > 2) {
                if (posArr[0].values == 5 && draftPicks > 3) {
                    return yLoc(d.year) + radius *2.7
                }
                return yLoc(d.year) + radius*1.4
            }
            return yLoc(d.year)
        }
    var y = d3.time.scale()
    .range([height/YLOC_SCALE, 0]);
    var yAxis = d3.svg.axis().scale(y)
    .orient("left")
    y.domain([new Date(d3.min(drafts, function(d) { return d.year; }),0,1), new Date(d3.max(drafts, function(d) { return d.year; }),0,1)]);

// Add the scatterplot
    
drafts.forEach(function(d) {
        d.year =+ d.year
        positionsObject[d.year]=0
    })
    var circleGroup = svg.selectAll("dot")
    .data(drafts)
    .enter()
    .append("g")
        .attr("class", "circleWrap")
    
    prev_round = 0;
    prev_year = 2016;
    draftPicks = 0;
    circleGroup.append("circle")
        .attr("class", function(d) {
           if (legendKey.class[d.status] === undefined) {
               return "other"
           }
           return legendKey.class[d.status]
        })
        .attr("r", radius)
        .attr("cx", function(d,i) {
             return position(d)
         })
        .attr("cy", function(d) {
            return yPosition(d);
         })
    drafts.forEach(function(d) {
        d.year =+ d.year
        positionsObject[d.year]=0
    })
    prev_round = 0;
    prev_year = 2016;
    draftPicks = 0;
    circleGroup.append("text")
        .attr("class", "positionLabel")
        .attr("text-anchor", "middle")
        .text(function(d) {
        return d.position;
        })
        .attr("x", function(d,i) {
             return position(d)
         })
        .attr("y", function(d) {
            return yPosition(d)+5;
         }) 

    //hover preview
//    svg.selectAll("g > *")
    svg.selectAll("g")
        .on("mouseover", function(d) {
            d3.select(this).style("opacity", 1)
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
            d3.select(this).style("opacity", 1)
            d3.selectAll(".previewWrap")
                .style("top",(d3.mouse(document.body)[1] + 40) + "px")
                .style("left",(d3.mouse(document.body)[0] + 20) + "px");
        })
        .on("mouseout", function(d) {
            d3.selectAll(".previewWrap").remove();
            d3.select(this).style("opacity", .8)
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
                    return radius * 3 * (sum)+radius+14;
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
//            .style("font-family", "sans-serif")
//            .style("fill", "white")
            .text(legendKey.text[i][0]);
        count = count+1;
    }
}

function mouseClick(svg, mcDraft, clickProf, draft) {
    // On mouse click on any of the circles, show player profile
    var identifier = clickProf.slice(-1);
    svg.selectAll("g > g").each(function(d) {
        d3.select(this)
            .on("click", function(d) {
                var profile = mcDraft.filter(function(dClick) {
                        names = dClick.name.split(" ")
                        name = names[1]+", "+names[0]
                         return name === d.name;
                     });
            if (profile.length > 0) {
                if (d.clicked == undefined || !d.clicked) {
                    if (draft.active != undefined) {
                        draft.active.clicked = false;
                    }
                    if (draft.prevCircle != undefined) {
                        //Unhighlight the previously selected circle
                        d3.select(draft.prevCircle).style("stroke", function(d) {
                            return legendKey.basic[draft.prevCircle.className.baseVal.toUpperCase()];
                        })

                        d3.select(draft.prevCircle).style("stroke-opacity", "1")
                        d3.select(draft.prevCircle).style("stroke-width", "2px")
                    
                    }
                    size = parseInt(window.innerWidth) * 0.2
                    draft.active = d;
                    d3.selectAll(clickProf+" > *").remove();
                    d3.select(clickProf).append("table").append("caption")
                        .attr("class", "nameCap")
                        .text(profile[0].name);
                    var tbody = d3.select(clickProf).select("table")
                        .append("tbody");
                    tbody.append("tr").append("td")
                        .attr("colspan", "2")
                        .attr("style", "text-align:center")
                        .append("img")
                        .attr("id", profile[0].name)
                        .attr("src", profile[0].picture)
                        .style("width", size + "px")
                        .style("height", size + "px");
                    tbody.append("tr").append("th")
                        .attr("colspan", "2")
                        .attr("class", "heading")
                        .text(function() {
                            if (profile[0].team == undefined) {
                                return "Not Active"
                            }
                            return profile[0].number + " " + profile[0].team
                    });
                    tbody.append("tr").append("th")
                        .attr("colspan", "2")
                        .attr("class", "heading")
                        .text("Personal Information");
                    tbody.append("tr")
                        .attr("id", "bornTr"+identifier)
                        .append("th")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .append("span")
                        .text("Born: ");
                    d3.select("#bornTr"+identifier)
                        .append("td").text(function() {
                        return checkUndefinedPlayer(profile[0].Born)
                    });
                    tbody.append("tr")
                        .attr("id", "ageTr"+identifier)
                        .append("th")
                        .attr("scope", "row")
                        .attr("class", "infoHeading")
                        .append("span").text("Age: ");
                    d3.select("#ageTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0].Age)
                    });
                    tbody.append("tr")
                        .attr("id", "heightTr"+identifier)
                        .append("th")
                        .attr("class", "infoHeading")
                        .attr("scope", "row")
                        .text("Height: ");
                    d3.select("#heightTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0].Height)
                    });
                    tbody.append("tr")
                        .attr("id", "weightTr"+identifier)
                        .append("th")
                        .attr("class", "infoHeading")
                        .attr("scope", "row")
                        .text("Weight: ");
                    d3.select("#weightTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0].Weight)
                    });
                    tbody.append("tr").append("th")
                        .attr("class", "heading")
                        .attr("colspan", "2")
                        .text("Career Information");
                    tbody.append("tr")
                        .attr("id", 'hsTr'+identifier)
                        .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("High School: ");
                    d3.select("#hsTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0]["High School"])
                    }
                        );
                    tbody.append("tr")
                        .attr("id", 'collegeTr'+identifier)
                        .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("College: ");
                    d3.select("#collegeTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0].College)
                    });
                    tbody.append("tr").append("th")
                        .attr("class", "heading")
                        .attr("colspan", "2")
                        .text("Career History");
                    tbody.append("tr")
                        .attr("id", "expTr"+identifier)
                        .append("td")
                            .attr("scope", "row")
                            .attr("class", "infoHeading")
                            .text("Experience: ");
                    d3.select("#expTr"+identifier).append("td")
                        .text(function() {
                        return checkUndefinedPlayer(profile[0].Experience)
                    });
                    tbody.append("tr").append("th")
                        .attr("class", "heading")
                        .attr("colspan", "2")
                        .text("Career NFL Statistics");
                    for (var k = 0; k < profile[0].stats.length; k++) {
                        var stat = profile[0].stats[k]
                        var statKeys = Object.keys(stat);
                        tbody.append("tr")
                            .attr("id", statKeys[0]+"Tr"+identifier)
                            .append("td")
                                .attr("scope", "row")
                                .attr("class", "infoHeading")
                                .text(statKeys[0] + ": ");
                        d3.select("#"+statKeys[0]+"Tr"+identifier).append("td")
                            .text(stat[statKeys[0]]);
                    }
                    goToByScroll(this.parentElement.parentElement.parentElement.parentElement.id, profile[0].name)
                    d.clicked = true;
                    //TODO: work for both sides
                    // highlights the circle when clicked
                    var childCircle = this.childNodes[0]
                    d3.select(childCircle).style("stroke", "#ffeb00")
                    d3.select(childCircle).style("stroke-opacity", ".5")
                    d3.select(childCircle).style("stroke-width", "6px")
                    draft.prevCircle = childCircle
                } else {
                    d3.selectAll(clickProf+" > *").remove();
                    d.clicked =false;
                    
                    //Unhighlight the circle and go back to normal styling
                    var childCircle = this.childNodes[0]
                    d3.select(childCircle).style("stroke", function(d) {
                        return legendKey.basic[childCircle.className.baseVal.toUpperCase()];
                    })

                    d3.select(childCircle).style("stroke-opacity", "1")
                    d3.select(childCircle).style("stroke-width", "2px")
                    
                }
            }
        })
    })
}

function goToByScroll(pid, id){
    // $('html,body').animate({scrollTop: $("[id='"+id+"']").offset().top},'medium');
    $('#'+pid).animate({scrollLeft: $("[id='"+id+"']").offset().left},'slow');
}

function checkUndefinedPlayer(playerInfo) {
    if (playerInfo == undefined) {
        return "-"
    }
    return playerInfo
}
