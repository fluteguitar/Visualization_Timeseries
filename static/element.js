/**
 * Created by CPU10368-local on 7/26/2016.
 */
$(document).ready(function() {
    $('#lstFruits').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends1').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends2').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends3').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends4').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends5').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends6').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends7').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends8').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends9').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#legends10').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
    $('#filter').multiselect({
        includeSelectAllOption: true,
        buttonText: function (options, select) {
            return options.length + " selected";
        }
    });
});


var Gdata;
var data;
var G1data;
var a;
var svg;
var color = d3.scale.category20();
var valueDefault;
var historyChoose = [];
var GGmouse = [];
var focus =[];
var xlocation = [];
var ylocation = [];
var gxScale =[];
var gyScale = [];
var G11data;
var isCombine = false;
var anomalyData = [];
var isHide = false;

function changeFile(){
    $("#lstFruits").empty();
    $("#filter").empty();
    $("#color").empty();
    $("#axis").empty();
    historyChoose = [];
    var option = document.createElement("option");
    option.text = "None";
    option.value = "200";
    option.id = "None";
    document.getElementById("color").add(option);
    var option = document.createElement("option");
    option.text = "Date";
    option.value = "0";
    document.getElementById("axis").add(option);

    d3.selectAll("svg").remove();
    findElement();
}

function changedate(isDefault){
    // Y-M-D
    var date = document.getElementById("startdate").value.split("-");
    var edate = document.getElementById("enddate").value.split("-");
    if(isDefault){
        date = valueDefault.startdate[0].split("-");
        edate = valueDefault.enddate[0].split("-");
        document.getElementById("startdate").value = valueDefault.startdate[0];
        document.getElementById("enddate").value = valueDefault.enddate[0];
    }
    var dstr = date[1].toString()+"/"+date[2].toString()+"/"+date[0].toString();
    var estr = edate[1].toString()+"/"+edate[2].toString()+"/"+edate[0].toString();

    G1data = G11data;

    var buf = d3.nest()
        .key(function(d) { return d[a[0]]; })
        .entries(G1data);

    var uni = buf.map(function (d) {
        return d["key"];
    });
    if(uni.indexOf(dstr)==-1||uni.indexOf(estr)==-1)alert("start date or end date is not in data");
    else{
        for(var i=0;i<uni.indexOf(dstr);i++) {
            G1data = G1data.filter(function (d) {
                return d[a[0]] != uni[i]
            })
        }
        for(var i=uni.indexOf(estr)+1;i<uni.length;i++) {
            G1data = G1data.filter(function (d) {
                return d[a[0]] != uni[i]
            })
        }
    }
    data = G1data;
    Gdata = G1data;
    /*
     var col = document.getElementById("color").value;
     var buf1 = d3.nest()
     .key(function(d) { return d[a[col]]; })
     .entries(Gdata);
     var name = buf1.map(function (d) {
     return d["key"]
     })
     $("#legends1").empty();
     for(var i=0;i<name.length;i++){
     var htm = '<option value="'+i+'" selected>' + name[i] + '</option>';
     $('#legends1').append(htm);
     }
     */
    $('#legends1').multiselect('rebuild');

    //if(!isDefault)showFilter(0,0);
    if(!isDefault)showFilter(0,0);




}

function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
        queryEnd   = url.indexOf("#") + 1 || url.length + 1,
        query = url.slice(queryStart, queryEnd - 1),
        pairs = query.replace(/\+/g, " ").split("&"),
        parms = {}, i, n, v, nv;

    if (query === url || query === "") {
        return;
    }

    for (i = 0; i < pairs.length; i++) {
        nv = pairs[i].split("=");
        n = decodeURIComponent(nv[0]);
        v = decodeURIComponent(nv[1]);

        if (!parms.hasOwnProperty(n)) {
            parms[n] = [];
        }

        parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
}

function CombineChart() {
    isCombine = document.getElementById("Combine").checked;
    if(isCombine){
        document.getElementById("color").value = 200;
        document.getElementById("None").innerHTML = "Disable";
        document.getElementById("color").disabled = true;

    }
    else {
        document.getElementById("color").disabled = false;
        document.getElementById("None").innerHTML = "None";
    }
    showlegends();
}

function hideDiv() {
    if (!isHide) {
        $('#summary').hide(1000);
        isHide = true;
        document.getElementById("hide").value = "Show Summary"
        //document.getElementById('field2').style.width='99%';
//        processing()
    }
    else{
        $('#summary').show(1000);
        isHide = false;
        document.getElementById("hide").value = "Hide Summary"
        //document.getElementById('field2').style.width='84%';
//        processing()
    }
}

function showSeasonal(){
    if(anomalyData.length != 1){
        document.getElementById("seasonalText").innerHTML = "Just for one chart";
        document.getElementById("seasonal").checked = false;
        return 0;
    }
    else if(document.getElementById("color").value != "200"){
        document.getElementById("seasonalText").innerHTML = "Just for date X-axis";
        document.getElementById("seasonal").checked = false;
        return 0;
    }
    var item = {};
    for (var i = 0; i < anomalyData.length; i++) {
        item[anomalyData[i]["indexCol"] + anomalyData[i]["indexlegend1"]] = anomalyData[i]["data"];
    }
    if (document.getElementById("seasonal").checked) {
        document.getElementById("seasonalText").innerHTML = "Working ...";
        // draw
        $.post("?",{"seasonal":item},
            function (response) {
                document.getElementById("seasonalText").innerHTML = "Seasonal";
                var ele = response
                var key = ele.split(":");
                var data = [];
                var width = document.getElementById("field2").clientWidth - 105;
                var height = width/5;
                var buf = key[1].split(",");
                for(var i=0;i< buf.length;i++)
                    if(buf[i]!="")data.push(parseFloat(buf[i]));
                for (var j = 0; j < anomalyData.length; j++) {
                    if (key[0].match(anomalyData[j]["indexCol"] + anomalyData[j]["indexlegend1"]) != null) {
                        drawaxis(20, width, width / 5, 60, height + 60 + 20,data);
                        //drawPath(anomalyData[j]["g"], anomalyData[j]["indexCol"], anomalyData[j]["indexlegend1"], anomalyData[j]["color"], anomalyData[j]["xScale"], anomalyData[j]["yScale"], anomalyData[j]["xLocation"], anomalyData[j]["yLocation"], 2, anomalyData[j]["whatType"], data)
                    }
                }

            }
        );


    }
    else {
        processing()
    }
}

function showTrend(){
    var item = {};
    for (var i = 0; i < anomalyData.length; i++) {
        item[anomalyData[i]["indexCol"] + anomalyData[i]["indexlegend1"]] = anomalyData[i]["data"];
    }
    if (document.getElementById("trend").checked) {
        document.getElementById("trendText").innerHTML = "Working ...";
        // draw
        $.post("?",{"trend":item},
            function (response) {
                document.getElementById("trendText").innerHTML = "Trend";
                var ele = response.split("-");
                for(var e =0; e< ele.length;e++){
                    var key = ele[e].split(":");
                    var data = [];
                    var buf = key[1].split(",");
                    for(var i=0;i< buf.length;i++)
                        if(buf[i]!="")data.push(parseFloat(buf[i]));
                    for (var j = 0; j < anomalyData.length; j++) {
                        if (key[0].match(anomalyData[j]["indexCol"] + anomalyData[j]["indexlegend1"]) != null) {
                            drawPath(anomalyData[j]["g"], anomalyData[j]["indexCol"], anomalyData[j]["indexlegend1"], anomalyData[j]["color"], anomalyData[j]["xScale"], anomalyData[j]["yScale"], anomalyData[j]["xLocation"], anomalyData[j]["yLocation"], 2, anomalyData[j]["whatType"], data)
                        }
                    }
                }
            }
        );


    }
    else {
        d3.selectAll("path.linetrend").remove()
    }
}

function showAnomaly() {
    var item = {};
    for (var i = 0; i < anomalyData.length; i++) {
        item[anomalyData[i]["indexCol"] + anomalyData[i]["indexlegend1"]] = anomalyData[i]["data"];
    }
    if (document.getElementById("anomaly").checked) {
        document.getElementById("ano").innerHTML = "Working ..."
        // draw
        $.post("?",{"point":item},
            function (response) {
                document.getElementById("ano").innerHTML = "Anomaly"
                var ele = response.split("-");
                for(var e =0; e< ele.length;e++){
                    var key = ele[e].split(":");
                    var data = []
                    var buf = key[1].split(",");
                    for(var i=0;i< buf.length;i++)
                        if(buf[i]!="")data.push(parseInt(buf[i]));
                    for (var j = 0; j < anomalyData.length; j++) {
                        if (key[0].match(anomalyData[j]["indexCol"] + anomalyData[j]["indexlegend1"]) != null) {
                            drawPath(anomalyData[j]["g"], anomalyData[j]["indexCol"], anomalyData[j]["indexlegend1"], anomalyData[j]["color"], anomalyData[j]["xScale"], anomalyData[j]["yScale"], anomalyData[j]["xLocation"], anomalyData[j]["yLocation"], 1, anomalyData[j]["whatType"], data)
                        }
                    }
                }
                //do
                document.getElementById("summary").innerHTML="some reports"

            }
        );


    }
    else {
        d3.selectAll("circle").remove()
    }
}

function findElement(){
    document.getElementById("g1").style.visibility = "hidden";
    document.getElementById("g2").style.visibility = "hidden";
    document.getElementById("g3").style.visibility = "hidden";
    document.getElementById("g4").style.visibility = "hidden";
    document.getElementById("g5").style.visibility = "hidden";
    document.getElementById("g6").style.visibility = "hidden";
    document.getElementById("g7").style.visibility = "hidden";
    document.getElementById("g8").style.visibility = "hidden";
    document.getElementById("g9").style.visibility = "hidden";
    document.getElementById("g10").style.visibility = "hidden";
    valueDefault = parseURLParams(window.location.search);

    var filename = document.getElementById("filename").value;
    if (typeof valueDefault != 'undefined' && typeof valueDefault.filename != 'undefined') {
        filename = valueDefault.filename.toString();
        document.getElementById("filename").value = valueDefault.filename.toString();
    }
    if(filename.match("csv")!=null) {
        d3.csv("data/hourly/" + filename, function (error, gdata) {
            a = d3.keys(gdata[0]).filter(function (key) {
                return key
            });
            var parseDate = d3.time.format("%m/%d/%Y").parse;
            var parseDate2 = d3.time.format("%Y-%m-%d").parse;
            var formatDate = d3.time.format("%m/%d/%Y");
            var formatDate2 = d3.time.format("%d-%b-%Y");
            var weekDay = d3.time.format("%A");

            gdata.forEach(function (d) {
                if (d[a[0]].match("-") != null)d[a[0]] = formatDate(parseDate2(d[a[0]]));
                else if (d[a[0]].match("/") != null)d[a[0]] = formatDate(parseDate(d[a[0]]));
            });
            gdata.map(function (d) {
                var dayOfWeek = parseDate(d[a[0]]).getDay()==0?6:parseDate(d[a[0]]).getDay()-1;
                var first = parseDate(d[a[0]]).getDate() - dayOfWeek; // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6
                var firstday = new Date(parseDate(d[a[0]]).setDate(first)); // 06-Jul-2014
                var lastday = new Date(parseDate(d[a[0]]).setDate(last)); //12-Jul-2014
                d.week = formatDate2(firstday) + " to " + formatDate2(lastday);
                d.weekDay = weekDay(parseDate(d[a[0]]));
                return d;
            });

            Gdata = gdata;
            data = gdata;
            G1data = gdata;
            G11data = gdata;
            a.push("weekDay");
            a.push("week");
            //document.getElementById("myDate").value
            var formatDate2 = d3.time.format("%Y-%m-%d");
            var g = d3.nest()
                .key(function (d) {
                    return d[a[0]];
                })
                .entries(data);
            document.getElementById("startdate").value = d3.min(g, function (d) {
                return formatDate2(parseDate(d["key"]));
            });
            document.getElementById("enddate").value = d3.max(g, function (d) {
                return formatDate2(parseDate(d["key"]));
            });

            var isfirstdraw = true;
            var color = document.getElementById("color");
            var axis = document.getElementById("axis");

            var defaultDraw = [];
            if (typeof valueDefault != 'undefined') defaultDraw = valueDefault.draw;
            $("#filter").empty();
            var htm = '<option value="'+0+'">' + a[0] + '</option>';
            $('#filter').append(htm);

            for (var i = 1; i < a.length; i++) {
                var r = data.map(function (d) {
                    return d[a[i]];
                })[1]
                if (isNaN(r)) {
                    var option = document.createElement("option");
                    option.text = a[i];
                    option.value = i;
                    color.add(option);
                    var htm = '<option value="'+i+'">' + a[i] + '</option>';
                    $('#filter').append(htm);
                }
                else {
                    var htm = '<option value="' + i + '">' + a[i] + '</option>';
                    if (typeof valueDefault != 'undefined' && typeof defaultDraw != 'undefined' && defaultDraw.indexOf(i.toString()) != -1) htm = '<option value="' + i + '" selected>' + a[i] + '</option>';
                    if (isfirstdraw && typeof valueDefault == 'undefined') {
                        htm = '<option value="' + i + '" selected>' + a[i] + '</option>';
                        isfirstdraw = false;
                    }
                    $('#lstFruits').append(htm);

                }
                if(a[i].match("hour")!=null || a[i].match("weekDay")!=null || a[i].match("rovince")!=null) {
                    var option = document.createElement("option");
                    option.text = a[i];
                    option.value = i;
                    axis.add(option);
                }
            }
            $('#lstFruits').multiselect('rebuild');
            $('#filter').multiselect('rebuild');

            if (typeof valueDefault != 'undefined') {
                document.getElementById("color").value = valueDefault.color;
            }
            if (typeof valueDefault != 'undefined' && typeof valueDefault.startdate != 'undefined')changedate(1);
            showlegends(1);
        });
    }
    else{
        d3.tsv("data/hourly/" + filename, function (error, gdata) {
            a = d3.keys(gdata[0]).filter(function (key) {
                return key
            });
            alert("done")
            var parseDate = d3.time.format("%m/%d/%Y").parse;
            var parseDate2 = d3.time.format("%Y-%m-%d").parse;
            var formatDate = d3.time.format("%m/%d/%Y");
            var formatDate2 = d3.time.format("%d-%b-%Y");
            var weekDay = d3.time.format("%A");

            gdata.map(function (d) {
                if (d[a[0]].match("-") != null)d[a[0]] = formatDate(parseDate2(d[a[0]]));
                else if (d[a[0]].match("/") != null)d[a[0]] = formatDate(parseDate(d[a[0]]));
            });
  /*          gdata.map(function (d) {
                var dayOfWeek = parseDate(d[a[0]]).getDay()==0?6:parseDate(d[a[0]]).getDay()-1;
                var first = parseDate(d[a[0]]).getDate() - dayOfWeek; // First day is the day of the month - the day of the week
                var last = first + 6; // last day is the first day + 6
                var firstday = new Date(parseDate(d[a[0]]).setDate(first)); // 06-Jul-2014
                var lastday = new Date(parseDate(d[a[0]]).setDate(last)); //12-Jul-2014
                d.week = formatDate2(firstday) + " to " + formatDate2(lastday);
                d.weekDay = weekDay(parseDate(d[a[0]]));
                return d;
            });
*/
            Gdata = gdata;
            data = gdata;
            G1data = gdata;
            G11data = gdata;
            a.push("weekDay");
            a.push("week");
            //document.getElementById("myDate").value
            var formatDate2 = d3.time.format("%Y-%m-%d");
            var g = d3.nest()
                .key(function (d) {
                    return d[a[0]];
                })
                .entries(data);
            document.getElementById("startdate").value = d3.min(g, function (d) {
                return formatDate2(parseDate(d["key"]));
            });
            document.getElementById("enddate").value = d3.max(g, function (d) {
                return formatDate2(parseDate(d["key"]));
            });

            var isfirstdraw = true;
            var color = document.getElementById("color");
            var axis = document.getElementById("axis");

            var defaultDraw = [];
            if (typeof valueDefault != 'undefined') defaultDraw = valueDefault.draw;
            $("#filter").empty();
            var htm = '<option value="'+0+'">' + a[0] + '</option>';
            $('#filter').append(htm);
            for (var i = 1; i < a.length; i++) {
                var r = data.map(function (d) {
                    return d[a[i]];
                })[1]
                if (isNaN(r)) {
                    var option = document.createElement("option");
                    option.text = a[i];
                    option.value = i;
                    color.add(option);
                    var htm = '<option value="'+i+'">' + a[i] + '</option>';
                    $('#filter').append(htm);
                }
                else {
                    var htm = '<option value="' + i + '">' + a[i] + '</option>';
                    if (typeof valueDefault != 'undefined' && typeof defaultDraw != 'undefined' && defaultDraw.indexOf(i.toString()) != -1) htm = '<option value="' + i + '" selected>' + a[i] + '</option>';
                    if (isfirstdraw && typeof valueDefault == 'undefined') {
                        htm = '<option value="' + i + '" selected>' + a[i] + '</option>';
                        isfirstdraw = false;
                    }
                    $('#lstFruits').append(htm);

                }
                if(a[i].match("hour")!=null || a[i].match("weekDay")!=null || a[i].match("rovince")!=null) {
                    var option = document.createElement("option");
                    option.text = a[i];
                    option.value = i;
                    axis.add(option);
                }
            }
            $('#lstFruits').multiselect('rebuild');
            $('#filter').multiselect('rebuild');

            if (typeof valueDefault != 'undefined') {
                document.getElementById("color").value = valueDefault.color;
            }
            if (typeof valueDefault != 'undefined' && typeof valueDefault.startdate != 'undefined')changedate(1);
            showlegends(1);
        });
    }
}

function showlegends(isDefaut) {
    document.getElementById("g2").style.visibility = "hidden";
    document.getElementById("g3").style.visibility = "hidden";
    document.getElementById("g4").style.visibility = "hidden";
    document.getElementById("g5").style.visibility = "hidden";
    document.getElementById("g6").style.visibility = "hidden";
    document.getElementById("g7").style.visibility = "hidden";
    document.getElementById("g8").style.visibility = "hidden";
    document.getElementById("g9").style.visibility = "hidden";
    document.getElementById("g10").style.visibility = "hidden";
    var legends1Default = typeof valueDefault != 'undefined' ? valueDefault.legend1 : [];
    var col = document.getElementById("color").value;
    $("#filter option:selected").prop("selected", false);
    $("#filter").multiselect('refresh');
    $('#filter').multiselect('select', col);
    var name;
    data = G1data;
    Gdata = G1data;
    if (!isCombine) {
        var buf = d3.nest()
            .key(function (d) {
                return d[a[col]];
            })
            .entries(data);
        name = buf.map(function (d) {
            return d["key"]
        });
        if (col != "200")document.getElementById("b0").innerHTML = a[col];
        else document.getElementById("b0").innerHTML = "Metric"
        $("#legends1").empty();
        document.getElementById("b1").innerHTML = a[col] + ": ";
    }
    else {
        name = [];
        var opt = $("#lstFruits option");
        for (var i = 0; i < opt.length; i++) {
            name.push(opt[i].innerHTML)
        };
        document.getElementById("b0").innerHTML = "Metric";
        $("#legends1").empty();
        document.getElementById("b1").innerHTML = "Metric: ";
    };
    if (!isCombine && col != "0" && a[col] != "week") {
        for (var i = 0; i < name.length; i++) {
            var htm = '<option value="' + i + '" selected>' + name[i] + '</option>';
            if (isDefaut && typeof valueDefault != 'undefined' && typeof legends1Default != 'undefined' && legends1Default.indexOf(i.toString()) == -1)htm = '<option value="' + i + '">' + name[i] + '</option>';
            $('#legends1').append(htm);
        }
    }
    else if (col == "0" || a[col] == "week") {
        for (var i = 0; i < name.length; i++) {
            var htm = '<option value="' + i + '">' + name[i] + '</option>';
            if (isDefaut && typeof valueDefault != 'undefined' && typeof legends1Default != 'undefined' && legends1Default.indexOf(i.toString()) == -1)htm = '<option value="' + i + '">' + name[i] + '</option>';
            else if (i == name.length - 1)htm = '<option value="' + i + '" selected>' + name[i] + '</option>';
            $('#legends1').append(htm);
        }
    }
    else {
        for (var i = 0; i < name.length; i++) {
            var htm = '<option value="' + i + '" selected>' + name[i] + '</option>';
            if (isDefaut && typeof valueDefault != 'undefined' && typeof legends1Default != 'undefined' && legends1Default.indexOf(i.toString()) == -1)htm = '<option value="' + i + '">' + name[i] + '</option>';
            $('#legends1').append(htm);
        }
    }
    $('#legends1').multiselect('rebuild');

    color.domain(d3.keys(name).filter(function (key) {
        return key;
    }));
     var selected = $("#legends1 option:selected");
    name = [];
    selected.each(function () {
        name.push($(this).text());
    });

    // draw legend
    var r = d3.select("div.legend")
    r.select("svg").remove()
    var legends = d3.select("div.legend")
        .append("svg")
        .attr("style", "width:100%;")
        .attr("height", name.length * 20)
    legends.selectAll('rect')
        .data(name)
        .enter()
        .append("rect")
        .attr("x", 20)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", 15)
        .attr("height", 15)
        .attr("transform", "translate(0,5)")
        .style("fill", function (d, i) {
            return color([name[i]])
        });
    legends.selectAll('text')
        .data(name)
        .enter()
        .append("text")
        .attr("x", 40)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("transform", "translate(0,17)")
        .text(function (d, i) {
            if(col!=200||isCombine)return name[i]
            else return"Metric"
        });

    showFilter(isDefaut, 0);
}

function showFilter(isDefault,isLegend1) {
    document.getElementById("g1").style.visibility = "hidden";
    document.getElementById("g2").style.visibility = "hidden";
    document.getElementById("g3").style.visibility = "hidden";
    document.getElementById("g4").style.visibility = "hidden";
    document.getElementById("g5").style.visibility = "hidden";
    document.getElementById("g6").style.visibility = "hidden";
    document.getElementById("g7").style.visibility = "hidden";
    document.getElementById("g8").style.visibility = "hidden";
    document.getElementById("g9").style.visibility = "hidden";
    document.getElementById("g10").style.visibility = "hidden";
    var selected = $("#filter option:selected");
    var nameFilter = [];
    var gcolor = document.getElementById("color").value;
//data = Gdata;
    selected.each(function () {
        if($(this).val()!=gcolor)
            nameFilter.push($(this).text());
        else
            document.getElementById("g1").style.visibility = "visible";
    });
    for(var j=0;j<nameFilter.length;j++) {
        var legends = typeof valueDefault!='undefined'?valueDefault["legend"+(j+2)]:[];
        var buf = d3.nest()
            .key(function (d) {
                return d[nameFilter[j]];
            })
            .entries(data);
        var name = buf.map(function (d) {
            return d["key"]
        })
        var old = d3.nest()
            .key(function (d) {
                return d[nameFilter[j]];
            })
            .entries(Gdata);
        var nameOld = old.map(function (d) {
            return d["key"]
        })

        $("#legends"+(j+2)).empty();
        document.getElementById("g"+(j+2)).style.visibility = "visible";
        document.getElementById("b"+(j+2)).innerHTML = nameFilter[j] + ": ";
        for (var i = 0; i < nameOld.length; i++) {
            var htm = '<option value="'+i+'" selected>' + nameOld[i] + '</option>';
            if(name.indexOf(nameOld[i])==-1)htm = '<option value="'+i+'">' + nameOld[i] + '</option>';
            if(isDefault && typeof valueDefault!='undefined' && typeof legends!='undefined' && legends.indexOf(i.toString())==-1)htm = '<option value="'+i+'">' + nameOld[i] + '</option>';
            $('#legends'+(j+2)).append(htm);

        }
        $('#legends'+(j+2)).multiselect('rebuild');

    }
    filterData(isDefault,isLegend1);
}

function filterData(isDefault,isLegend1){
    var selected = $("#filter option:selected");
    var nameFilter = [];
    var col = document.getElementById("color").value;
    selected.each(function () {
        if($(this).val()!=col)
            nameFilter.push($(this).text());
        else
            document.getElementById("g1").style.visibility = "visible";
    });
    data=Gdata;
    for (var i = 0; i < nameFilter.length; i++) {
        var subselected = $("#legends" + (i + 2) + " option:selected");
        var subnameFilter = [];
        subselected.each(function () {
            subnameFilter.push($(this).text());
        });
        var t = d3.nest()
            .key(function (d) {
                return d[nameFilter[i]];
            })
            .entries(data);
        var uni = t.map(function (d) {
            return d["key"]
        })
        for (var j = 0; j < uni.length; j++) {
            if(subnameFilter.indexOf(uni[j])==-1) {
                data = data.filter(function (d) {
                    return d[nameFilter[i]] != uni[j]
                })

            }
        }
    }
    ////////////////////////////////////////////////
    /////////////// rebuilt legend1
    if(!isDefault && !isLegend1 && !isCombine && col!="0" && a[col]!="week") {
        //var buf = d3.nest()
        //    .key(function (d) {
        //        return d[a[col]];
        //    })
        //    .entries(data);
        // var name = buf.map(function (d) {
        //   return d["key"]
        // })
        selected = $("#legends1 option:selected");
        var name = [];
        selected.each(function () {
            name.push($(this).text());
        });

        var old = d3.nest()
            .key(function (d) {
                return d[a[col]];
            })
            .entries(G1data);
        var nameold = old.map(function (d) {
            return d["key"]
        });
        $("#legends1").empty();
        for (var i = 0; i < nameold.length; i++) {
            var index = name.indexOf(nameold[i])
            var htm = '<option value="' + i + '" selected>' + nameold[i] + '</option>';
            if(index==-1)htm = '<option value="' + i + '">' + nameold[i] + '</option>';
            $('#legends1').append(htm);


        }
        $('#legends1').multiselect('rebuild');

    }

    processing(1)
}

function filterLegend1() {
    var selected = $("#legends1 option:selected");
    var name = [];
    selected.each(function () {
        name.push($(this).text());
    });
    if(!isCombine) {
        Gdata = G1data;
        var col = document.getElementById("color").value;
        var t = d3.nest()
            .key(function (d) {
                return d[a[col]];
            })
            .entries(Gdata);
        var uni = t.map(function (d) {
            return d["key"]
        })
        for (var j = 0; j < uni.length; j++) {
            if (name.indexOf(uni[j]) == -1) {
                Gdata = Gdata.filter(function (d) {
                    return d[a[col]] != uni[j]
                })
            }
        }
        data = Gdata;

        var r = d3.select("div.legend")
        r.select("svg").remove()
        var legends = d3.select("div.legend")
            .append("svg")
            .attr("style","width:100%;")
            .attr("style", "Background:white;")
            .attr("height",name.length*20)
        legends.selectAll('rect')
            .data(name)
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", function(d, i){ return i *  20;})
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform","translate(0,5)")
            .style("fill", function(d,i){
                return color([name[i]])
            });
        legends.selectAll('text')
            .data(name)
            .enter()
            .append("text")
            .attr("x", 40)
            .attr("y", function(d, i){ return i *  20;})
            .attr("transform","translate(0,17)")
            .text(function(d,i){return name[i]});



        showFilter(0, 1);
    }
    else {
        selected = $("#lstFruits option:selected");
        name = [];
        selected.each(function () {
            name.push($(this).text());
        });
        var r = d3.select("div.legend")
        r.select("svg").remove()
        var legends = d3.select("div.legend")
            .append("svg")
            .attr("style","width:100%;")
            .attr("style", "Background:white;")
            .attr("height",name.length*20)
        legends.selectAll('rect')
            .data(name)
            .enter()
            .append("rect")
            .attr("x", 20)
            .attr("y", function(d, i){ return i *  20;})
            .attr("width", 15)
            .attr("height", 15)
            .attr("transform","translate(0,5)")
            .style("fill", function(d,i){
                return color([name[i]])
            });
        legends.selectAll('text')
            .data(name)
            .enter()
            .append("text")
            .attr("x", 40)
            .attr("y", function(d, i){ return i *  20;})
            .attr("transform","translate(0,17)")
            .text(function(d,i){return name[i]});
        var width = document.getElementById("field2").clientWidth - 105;
        drawaxis(0, width, width / 5, 60, 20,0);
    }
}

function changeAxis() {
    // rebuilt color
    $("#color").empty();
    var isfirst = true;
    var axis = document.getElementById("axis").value;
    var color = document.getElementById("color");
    var option = document.createElement("option");
    option.text = "None";
    option.value = 200;
    option.id = "None"
    if(axis==0){
        option.selected = true;
        isfirst = false;
    }
    color.add(option);
    if(axis!="0"&&a[axis]!="weekDay") {
        var option = document.createElement("option");
        option.text = a[0];
        option.value = 0;
        option.selected = true;
        color.add(option);
        isfirst = false;
    }
    for (var i = 1; i < a.length; i++) {
        if(i != axis) {
            var r = data.map(function (d) {
                return d[a[i]];
            })[1];
            if (isNaN(r)) {
                var option = document.createElement("option");
                option.text = a[i];
                option.value = i;
                if (isfirst && a[axis]!="weekDay") {
                    option.selected = true;
                    isfirst = false;
                }
                else if(isfirst){
                    if(a[i]=="week")option.selected=true;
                }
                color.add(option);
            }
        }
    }
    showlegends(0)
}

function processing() {
    //history
    document.getElementById("anomaly").checked = false
    document.getElementById("trend").checked = false
    var width = document.getElementById("field2").clientWidth - 105;
    var height = width/5;
    anomalyData = [];
    if(a[document.getElementById("axis").value].match("rovince")!=null)height = height + 80;
    if(!isCombine) {
        var choose = $("#lstFruits").val();
        if (choose == null)historyChoose = [];
        else {
            if (choose.length > historyChoose.length) {
                for (var i = 0; i < choose.length; i++) {
                    if (historyChoose.indexOf(choose[i]) == -1)historyChoose.push(choose[i]);
                }
            }
            else {
                for (var i = 0; i < historyChoose.length; i++) {
                    if (choose.indexOf(historyChoose[i]) == -1)historyChoose.splice(i, 1)
                }
            }
        }
        GGmouse = [];
        focus = [];
        xlocation = [];
        ylocation = [];
        gxScale = [];
        gyScale = [];
        var b = d3.select("div.g");
        b.select("svg").remove();
        svg = d3.select("div.g")
            .append("svg")
            .attr("width", width + 63)
            .attr("style", "Background:white;")
            .attr("height", (height + 100) * (historyChoose.length+1));
        svg.selectAll("g").remove()
        svg.selectAll("text").remove()
        d3.selectAll("path").remove()
        d3.selectAll("circle").remove()

        for (var i = 0; i < historyChoose.length; i++)
            drawaxis(historyChoose[i], width, width / 5, 60, (height + 60) * i + 20,0);

    }
    else {
        GGmouse = [];
        focus = [];
        xlocation = [];
        ylocation = [];
        gxScale = [];
        gyScale = [];
        var b = d3.select("div.g");
        b.select("svg").remove();
        svg = d3.select("div.g")
            .append("svg")
            .attr("style", "Background:white;")
            .attr("width", width + 63)
            .attr("height", (height + 100));
        svg.selectAll("g").remove()
        svg.selectAll("text").remove()
        d3.selectAll("path").remove()
        d3.selectAll("circle").remove()
        filterLegend1();
    }
}

function drawaxis(indexCol,width,height,xLocation,yLocation,seasonal){


    svg.append("g")
        .attr("class", "y axis"+indexCol);

    svg.append("g")
        .attr("class", "x axis"+indexCol);
    var xScale = d3.time.scale().range([0, width]);
    var parseDate = d3.time.format("%m/%d/%Y").parse;



    var yScale = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    var axis = document.getElementById("axis").value;
    var g = d3.nest()
        .key(function(d) { return d[a[axis]]; })
        .entries(data);
    // extract the x labels for the axis and scale domain
    var whatType;
    if(axis==0) {
        xScale.domain(d3.extent(g, function (d) {
            return parseDate(d["key"]);
        }));
        svg.select(".x.axis" + indexCol)
            .attr("transform", "translate(" + (xLocation) + "," + (yLocation + height) + ")")
            .attr("stroke", "black")
            .attr("fill", "none")
            .attr("stroke-width", 1)
            .call(xAxis.ticks(10).tickFormat(d3.time.format("%d-%b"))).selectAll(".tick").each(function(data) {
                svg.append("line")
                    .attr("x1", xScale(data))
                    .attr("y1", 0)
                    .attr("x2", xScale(data))
                    .attr("y2", height)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
                    .attr("stroke-width", 0.1)
                    .attr("stroke", "black");

                });
        whatType=0;
    }
    else {
        var r = data.map(function (d) {
            return d[a[axis]];
        })[1];
        if (!isNaN(r)) {
            xScale = d3.scale.linear()
                .range([0, width]);
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");

            xScale.domain(d3.extent(g, function (d) {
                return parseFloat(d["key"]);
            }));
            svg.select(".x.axis" + indexCol)
                .attr("transform", "translate(" + (xLocation) + "," + (yLocation + height) + ")")
                .attr("stroke", "black")
                .attr("fill", "none")
                .attr("stroke-width", 1)
                .call(xAxis.ticks(10).tickFormat(d3.format("1000s"))).selectAll(".tick").each(function(data) {
                svg.append("line")
                    .attr("x1", xScale(data))
                    .attr("y1", 0)
                    .attr("x2", xScale(data))
                    .attr("y2", height)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
                    .attr("stroke-width", 0.1)
                    .attr("stroke", "black");

            });
            whatType = 1;
        }
        else{
            xScale = d3.scale.ordinal()
                .rangeRoundBands([0, width]);
            xAxis = d3.svg.axis()
                .scale(xScale)
                .orient("bottom");
            var xLabels;
            if(a[axis]!="weekDay") {
                var buf = d3.nest()
                    .key(function (d) {
                        return d[a[axis]];
                    })
                    .entries(data);
                xLabels = buf.map(function (d) {
                    return d["key"]
                });
                xScale.domain(xLabels);
            }
            else{
                xLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                xScale.domain(xLabels);
            }
            if(xLabels.length>10) {
                svg.select(".x.axis" + indexCol)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation + height) + ")")
                    .attr("stroke", "black")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .call(xAxis.tickValues(xLabels)).selectAll(".tick").each(function(data) {
                    svg.append("line")
                        .attr("x1", xScale(data))
                        .attr("y1", 0)
                        .attr("x2", xScale(data))
                        .attr("y2", height)
                        .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
                        .attr("stroke-width", 0.1)
                        .attr("stroke", "black");

                    })
                    .selectAll("text")
                    .style("text-anchor", "end")
                    .attr("transform", function (d) {
                        return "rotate(-45)";
                    });
            }
            else{
                svg.select(".x.axis" + indexCol)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation + height) + ")")
                    .attr("stroke", "black")
                    .attr("fill", "none")
                    .attr("stroke-width", 1)
                    .call(xAxis.tickValues(xLabels)).selectAll(".tick").each(function(data) {
                    svg.append("line")
                        .attr("x1", xScale(data))
                        .attr("y1", 0)
                        .attr("x2", xScale(data))
                        .attr("y2", height)
                        .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
                        .attr("stroke-width", 0.1)
                        .attr("stroke", "black");

                });
            }
            whatType = 2;
        }

    }
    svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", 0)
        .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
        .attr("stroke-width", 1)
        .attr("stroke", "black");
    _yScale(indexCol,width,height,yAxis,xLocation,yLocation,xLabels,xScale,yScale,whatType,seasonal)

}

function _yScale(indexCol,width,height,yAxis,xLocation,yLocation,xLabels,xScale,yScale,whatType,seasonal) {
    /////////////////////////////////////////////////////////////
    //////////////////////// yScale

    var selected = $("#legends1 option:selected");
    var name = [];

    selected.each(function () {
        name.push($(this).text());
    });
    var gcolor = document.getElementById("color").value;
    var axis = document.getElementById("axis").value;
    var maxeachcol = [];
    var mineachcol = [];
    var g;
    var da;
    if(a[axis].match("weekDay")!=null)da = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
    else da = xLabels;
    var G=[];
    if(!isCombine && seasonal==0) {
        // sort axis
        // 0 Sum, 1 mean, 2 max, 3 min
        if(a[axis].match("weekDay")!=null || a[axis].match("rovince")!=null){
            g = d3.nest()
                .key(function (d) {
                    return d[a[gcolor]];
                })
                .key(function (d) {
                    return d[a[axis]]
                }).sortKeys(function(a,b) { return da.indexOf(a) - da.indexOf(b); })
                .rollup(function (v) {
                        return d3.sum(v, function (d) {
                            return d[a[indexCol]];
                        });
                })
                .entries(data);
        }
        else if(whatType==1) {
            g = d3.nest()
                .key(function (d) {
                    return d[a[gcolor]];
                })
                .key(function (d) {
                    return d[a[axis]]
                }).sortKeys(function(a,b) { return parseFloat(a) - parseFloat(b); })
                .rollup(function (v) {
                        return d3.sum(v, function (d) {
                            return d[a[indexCol]];
                        });
                })
                .entries(data);
        }

        else {
            g = d3.nest()
                .key(function (d) {
                    return d[a[gcolor]];
                })
                .key(function (d) {
                    return d[a[axis]];
                })
                .rollup(function (v) {
                        return d3.sum(v, function (d) {
                            return d[a[indexCol]];
                        });
                })
                .entries(data);
        }
        var uni = g.map(function (d) {
            return d["key"]
        });
        for (var i = 0; i < name.length; i++) {
            var index = uni.indexOf(name[i]);
            var element = g.map(function (d) {
                return d["values"]
            })

            maxeachcol.push(d3.max(element[index], function (d) {
                return d["values"]
            }))
            mineachcol.push(d3.min(element[index], function (d) {
                return d["values"]
            }))
        };
    }
    else if(seasonal!=0){
        maxeachcol.push(Math.max.apply(null, seasonal))
        mineachcol.push(Math.min.apply(null, seasonal))
    }
    else{
        selected = $("#lstFruits option:selected");

        name = [];

        selected.each(function () {
            name.push($(this).text());
        });
        for (var i = 0; i < name.length; i++) {
            if(a[axis].match("weekDay")!=null || a[axis].match("rovince")!=null){
                g = d3.nest()
                    .key(function (d) {
                        return d[a[axis]];
                    }).sortKeys(function(a,b) { return da.indexOf(a) - da.indexOf(b); })
                    .rollup(function (v) {
                            return d3.sum(v, function (d) {
                                return d[name[i]];
                            });
                    })
                    .entries(data);
            }
            else if(whatType==1){
                g = d3.nest()
                    .key(function (d) {
                        return d[a[axis]];
                    }).sortKeys(function(a,b) { return parseFloat(a) - parseFloat(b); })
                    .rollup(function (v) {
                            return d3.sum(v, function (d) {
                                return d[name[i]];
                            });
                    })
                    .entries(data);
            }
            else {
                g = d3.nest()
                    .key(function (d) {
                        return d[a[axis]];
                    })
                    .rollup(function (v) {
                            return d3.sum(v, function (d) {
                                return d[name[i]];
                            });
                    })
                    .entries(data);
            }
            maxeachcol.push(d3.max(g, function (d) {
                return d["values"]
            }));
            mineachcol.push(d3.min(g, function (d) {
                return d["values"]
            }));
            G.push(g)
        }
    }
    //console.log(maxeachcol)

    var low = Math.min.apply(null, mineachcol)>=0?Math.min.apply(null, mineachcol)*0.8:Math.min.apply(null, mineachcol)*1.02;

    yScale.domain([low, Math.max.apply(null, maxeachcol)*1.02]);
    svg.select(".y.axis"+indexCol)
        .attr("stroke","black")
        .attr("fill","none")
        .attr("stroke-width",1)
        .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
        .call(yAxis.tickFormat(d3.format("1000s"))).selectAll(".tick").each(function(data) {
            svg.append("line")
                .attr("x1", 0)
                .attr("y1", yScale(data))
                .attr("x2", width)
                .attr("y2", yScale(data))
                .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
                .attr("stroke-width", 0.1)
                .attr("stroke", "black");
        });

    if(!isCombine) {
        svg.append("text")
            .attr("class", "b")
            .text(a[indexCol])
            .attr("y", xLocation - 50)
            .attr("x", -(yLocation + height / 3))
            .attr("transform", "rotate(-90 40 40)")
            .attr("font-size", "15px");
    }
    else{
        svg.append("text")
            .attr("class", "b")
            .text("Value")
            .attr("y", xLocation - 50)
            .attr("x", -(yLocation + height / 3))
            .attr("transform", "rotate(-90 40 40)")
            .attr("font-size", "15px");

    }
    if(yLocation<width/6) {
        svg.append("text")
            .attr("class", "b")
            .text(a[document.getElementById("axis").value])
            .attr("x", xLocation + width / 2)
            .attr("y", yLocation - width / 200)
            .attr("font-size", "15px");
    }
    svg.append("line")
        .attr("x1", width)
        .attr("y1", 0)
        .attr("x2", width)
        .attr("y2", height)
        .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")")
        .attr("stroke-width", 1)
        .attr("stroke", "black");


    var distance=0;
    if(whatType==2) {
        if(!isCombine){
            var value = g.map(function (d) {
                return d["values"];
            })[0];
            distance = xScale(value.map(function (d) {return d["key"];})[1])-xScale(value.map(function (d) {return d["key"];})[0])
        }
        else distance = xScale(g.map(function (d) {return d["key"];})[1])-xScale(g.map(function (d) {return d["key"];})[0])
    }
    xLocation = xLocation+distance/2;
    var ano = []
    if(!isCombine && seasonal==0) {
        var Gmouse = g;
        for (var i = 0; i < name.length; i++) {
            var index = uni.indexOf(name[i]);
            drawPath(g, indexCol, index, color(name[i]), xScale, yScale, xLocation, yLocation,0,whatType,ano)
        }

        for (var j = 0; j < g.length; j++) {
            if (name.indexOf(uni[j]) == -1) {
                Gmouse = Gmouse.filter(function (d) {
                    return d["key"] != uni[j]
                })

            }
        }
        GGmouse.push(Gmouse);
    }
    else if(seasonal!=0){
        g = d3.nest()
            .key(function (d) {
                return d[a[axis]];
            })
            .entries(data);
        var key = g.map(function (d) {
            return d["key"];
        });

        for(var i=0;i<g.length;i++) {
            g[i].key = key[i]
            g[i].values = seasonal[i]
        }
        ano = seasonal
        drawPath(g, indexCol, index, color(name[i]), xScale, yScale, xLocation, yLocation,0,whatType,ano);
        GGmouse.push([g]);

    }
    else{
        var Gmouse =[];
        for (var i = 0; i < name.length; i++) {
            var isAnomaly = name[i].match("nomaly")!=null?1:0
            drawPath(G[i], indexCol, i, color(name[i]), xScale, yScale, xLocation, yLocation,isAnomaly,whatType,ano);
            Gmouse.push(G[i]);
        }

        GGmouse.push(Gmouse);
    }
    mouseEvent(indexCol,width,height,xLocation,yLocation,xScale,yScale,whatType,distance/2,ano);

}

function drawPath(g,indexCol,indexlegend1,color,xScale,yScale,xLocation,yLocation,isAnomaly,whatType,ano)   {
        var value = g.map(function (d) {
            return d["values"];
        });
    //trend
    var stroke = 3
    if(isAnomaly==2){
        for(var i=0;i<value[indexlegend1].length;i++) {
            value[indexlegend1][i].trend = ano[i]
        }
        color = "red"
        stroke = 1.5
    }
    if(isAnomaly!=1) {
        var parseDate = d3.time.format("%m/%d/%Y").parse;
        var line = d3.svg.line()
            .x(function (d) {
                if(whatType==0)return xScale(parseDate(d["key"]));
                else if(whatType==1)return xScale(parseFloat(d["key"]));
                else return xScale((d["key"]));
            })
            .y(function (d) {
                if(isAnomaly==2)return yScale(d["trend"]);
                else return yScale(d["values"]);
            });
        var t = d3.select("div.g")
        var svg = t.select("svg")
        if (!isCombine && (ano.length==0||isAnomaly==2)) {
            var data = value[indexlegend1].map(function (d) {
                return d["values"];
            });
            if(isAnomaly!=2){
                var info = {g:g,indexCol:indexCol,indexlegend1:indexlegend1,color:color,xScale:xScale,yScale:yScale,xLocation:xLocation,yLocation:yLocation,whatType:whatType,data:data};
                anomalyData.push(info);
            }
            if(isAnomaly!=2){
                svg.append("path")
                    .datum(value[indexlegend1])
                    .attr("class", "line" + indexlegend1 + indexCol)
                    .attr("d", line)
                    .attr("stroke", color)
                    .attr("fill", "none")
                    .attr("stroke-width", stroke)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")");
            }
            else{
                svg.append("path")
                    .datum(value[indexlegend1])
                    .attr("class", "linetrend")
                    .attr("d", line)
                    .attr("stroke", color)
                    .attr("fill", "none")
                    .attr("stroke-width", stroke)
                    .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")");
            }
        }
        else if(ano.length!=0){
            color = "red"
            stroke = 1.5
            svg.append("path")
                .datum(g)
                .attr("class", "lineAnomaly")
                .attr("d", line)
                .attr("stroke", color)
                .attr("fill", "none")
                .attr("stroke-width", stroke)
                .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")");

        }
        else {
            var data = g.map(function (d) {
                return d["values"]
            });
            var info = {g:g,indexCol:indexCol,indexlegend1:indexlegend1,color:color,xScale:xScale,yScale:yScale,xLocation:xLocation,yLocation:yLocation,whatType:whatType,data:data};
            anomalyData.push(info);
            svg.append("path")
                .datum(g)
                .attr("class", "line" + indexlegend1 + indexCol)
                .attr("d", line)
                .attr("stroke", color)
                .attr("fill", "none")
                .attr("stroke-width", 3)
                .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")");

        }
    }
    else {
        var parseDate = d3.time.format("%m/%d/%Y").parse;
        var buffe = []
        for (var i = 0; i < ano.length; i++) {
            if (ano[i] == "1")buffe.push(value[indexlegend1][i])

        }
        var xMap = function (d) {
            return xScale(parseDate(d["key"]));
        }
        var yMap = function (d) {
            return yScale(d["values"]);
        }
        var t = d3.select("div.g")
        var svg = t.select("svg")
            .append("g")
            .attr("class","do"+indexCol+indexlegend1)
        svg.selectAll(".dot")
            .data(buffe)
            .enter().append("circle")
            .attr("r", 2)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .style("fill", "red")
            .attr("transform", "translate(" + (xLocation) + "," + (yLocation) + ")");
    }
}

function mouseEvent(indexCol,width, height,xlocationbuf, ylocationbuf,xScale,yScale,whatType,distance,ano) {
    var t = d3.select("div.g")
    var svg = t.select("svg")
    var focusbuf = svg.append("g")
        .style("display", "none");
    focus.push(focusbuf);
    xlocation.push(xlocationbuf);
    ylocation.push(ylocationbuf);
    gxScale.push(xScale);
    gyScale.push(yScale);
    svg.select("rect.re"+indexCol).remove();
    /////////////////////////////////////////////
    /////// create a packet to send to mouse event
    var parameter = {indexCol:indexCol,xScale:xScale,yScale:yScale, width:width, height:height,whatType:whatType,distance:distance,ano:ano};
    svg.append("rect")
        .datum(parameter)
        .attr("class","re"+indexCol)
        .attr("width", width)
        .attr("height", height)
        .attr("transform", "translate("+(xlocationbuf)+","+ylocationbuf+")")
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function () {
            for (var i = 0; i < focus.length; i++)
                focus[i].style("display", null);

        })
        .on("mouseout", function () {
            for (var i = 0; i < focus.length; i++)
                focus[i].style("display", "none");

        })
        .on("mousemove", mousemove);

}

function mousemove(d) {
    var indexCol = d.indexCol,
        width = d.width,
        xScale = d.xScale,
        yScale = d.yScale,
        height = d.height,
        whatType = d.whatType,
        distance = d.distance,
        ano = d.ano,
        indexDate = [],
        values = [];

    var parseDate = d3.time.format("%m/%d/%Y").parse;
    var x0;
    var buf = d3.nest()
        .key(function(d) { return d[a[document.getElementById("axis").value]]; })
        .entries(data);
    var uni = buf.map(function (d) {
        return d["key"];
    })
    if(whatType==2){
        if(a[document.getElementById("axis").value]=="weekDay")uni = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var xxScale = d3.scale.linear()
            .range([0, width]);
        x0 = xxScale.invert(d3.mouse(this)[0])

    }
    else x0 = xScale.invert(d3.mouse(this)[0]);
    var y0 = yScale.invert(d3.mouse(this)[1]);
    var ind = historyChoose.indexOf(indexCol);
    if(ano.length!=0)ind=1
    var bisectDate = d3.bisector(function (d) {
        if(whatType==0)return (parseDate(d["key"]));
        else if(whatType==1)return (parseFloat(d["key"]));
        else return uni.indexOf(d["key"]);
    }).left;
    if(whatType==2){
        var xxScale = d3.scale.linear()
            .range([0, width]);
        xxScale.domain([0,buf.length])
        x0 = xxScale.invert(d3.mouse(this)[0])

    }

    var selected = $("#legends1 option:selected");

    var name = [];

    selected.each(function () {
        name.push($(this).text());
    });

    var gcolor = document.getElementById("color").value;
    if(!isCombine) {
        if (ano.length==0) {
            for (var i = 0; i < GGmouse[ind].length; i++) {
                var ix = bisectDate(GGmouse[ind][i].values, x0, 1),
                    d0 = GGmouse[ind][i].values[ix - 1],
                    d1 = GGmouse[ind][i].values[ix];
                if (ix == GGmouse[ind][i].values.length)indexDate.push(ix - 1);
                else {
                    var index;
                    if (whatType == 0)index = x0 - parseDate(d0["key"]) > parseDate(d1["key"]) - x0 ? ix : ix - 1;
                    else if (whatType == 1)index = x0 - parseFloat(d0["key"]) > parseFloat(d1["key"]) - x0 ? ix : ix - 1;
                    else if (whatType == 2) index = x0 - uni.indexOf(d0["key"]) > uni.indexOf(d1["key"]) - x0 ? ix : ix - 1;
                    indexDate.push(index);
                }
            }
            for (var i = 0; i < indexDate.length; i++) {
                values.push(Math.abs(y0 - GGmouse[ind][i].values[indexDate[i]].values))

            }
            var min = Math.min.apply(null, values);
            var indexmin = values.indexOf(min);
        }
        else{
            for (var i = 0; i < GGmouse[ind].length; i++) {
                var ix = bisectDate(GGmouse[ind][i], x0, 1),
                    d0 = GGmouse[ind][i][ix - 1],
                    d1 = GGmouse[ind][i][ix];
                if (ix == GGmouse[ind][i].length)indexDate.push(ix - 1);
                else {
                    var index;
                    if (whatType == 0)index = x0 - parseDate(d0["key"]) > parseDate(d1["key"]) - x0 ? ix : ix - 1;
                    else if (whatType == 1)index = x0 - parseFloat(d0["key"]) > parseFloat(d1["key"]) - x0 ? ix : ix - 1;
                    else if (whatType == 2) index = x0 - uni.indexOf(d0["key"]) > uni.indexOf(d1["key"]) - x0 ? ix : ix - 1;
                    indexDate.push(index);
                }
            }
            for (var i = 0; i < indexDate.length; i++) {
                values.push(Math.abs(y0 - GGmouse[ind][i][indexDate[i]].values))

            }
            var min = Math.min.apply(null, values);
            var indexmin = values.indexOf(min);

        }
    }
    else{
        ind = 0;
        for (var i = 0; i < GGmouse[ind].length; i++) {
            var ix = bisectDate(GGmouse[ind][i], x0, 1),
                d0 = GGmouse[ind][i][ix - 1],
                d1 = GGmouse[ind][i][ix];
            if (ix == GGmouse[ind][i].length)indexDate.push(ix - 1);
            else {
                var index;
                if(whatType==0)index = x0 - parseDate(d0["key"]) > parseDate(d1["key"]) - x0 ? ix : ix - 1;
                else if(whatType==1)index = x0 - parseFloat(d0["key"]) > parseFloat(d1["key"]) - x0 ? ix : ix - 1;
                else if(whatType==2) index = x0 - uni.indexOf(d0["key"]) > uni.indexOf(d1["key"]) - x0 ? ix : ix - 1;
                indexDate.push(index);
            }
        }
        for (var i = 0; i < indexDate.length; i++) {
            values.push(Math.abs(y0 - GGmouse[ind][i][indexDate[i]].values))

        }
        var min = Math.min.apply(null, values);
        var indexmin = values.indexOf(min);
    };
    ////////////////////////////////////////////////////////////////////////////
    //////////////////////
    //console.log(whatType)
    var formatdate = d3.time.format("%d-%b-%Y");

    if(ano.length!=0 && historyChoose.indexOf(20)==-1)historyChoose.push(20);
    for(var i =0;i<historyChoose.length;i++) {
        focus[i].select("circle.y" + historyChoose[i]).remove();
        focus[i].select("g.y" + historyChoose[i]).remove();
        focus[i].select("line.y" + historyChoose[i]).remove();

        // append the circle at the intersection
        focus[i].append("circle")
            .attr("class", "y" + historyChoose[i])
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("r", 4);

        focus[i].append("line")
            .attr("class", "y" + historyChoose[i])
            .style("stroke", "blue")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .attr("y1", ylocation[i])
            .attr("y2", ylocation[i] + height);

        var bar = focus[i].append("g")
            .attr("class", "y" + historyChoose[i]);
        if(historyChoose[i]==20){
            var widthRect = width / 5;
            var heightRect = width / 21;
            bar.append("rect")
                .attr("width", widthRect)
                .attr("height", heightRect)
                .style("fill", "#ffffff")
                .style("stroke-width", 0.5)
                .style("stroke", "rgb(0,0,0)");

            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 150)
                .attr("y", width / 150)
                .attr("dy", "1em")
                .text(a[document.getElementById("axis").value] + ": ");

            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 150)
                .attr("y", width / 150)
                .attr("dy", "2.5em")
                .text("Values : ");
            nameAxis = formatdate(parseDate(GGmouse[i][indexmin][indexDate[indexmin]].key));
            valueAxis = parseDate(GGmouse[i][indexmin][indexDate[indexmin]].key);
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "1em")
                .style("font-weight", "bold")
                .text(nameAxis);
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "2.5em")
                .style("font-weight", "bold")
                .text(GGmouse[i][indexmin][indexDate[indexmin]].values);

            var xtrans;
            var ytrans;
            var trans = focus[i].select("g.y" + historyChoose[i])
            if (gxScale[i](valueAxis) < width - widthRect - distance) {
                xtrans = gxScale[i](valueAxis) + xlocation[i] + 20
            }
            else {
                xtrans = width - widthRect -distance + xlocation[i] + 20;
            }
            if (gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) < height - heightRect) {
                ytrans = gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) + ylocation[i] + 20;
            }
            else {
                ytrans = height - heightRect + ylocation[i] - heightRect;
            }
            trans.attr("transform",
                "translate(" + xtrans + "," +
                ytrans + ")");
            focus[i].select("circle.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    (gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) + ylocation[i]) + ")");
            focus[i].select("line.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    0 + ")");

          //  historyChoose.pop()
            return 0;
        }

        var widthRect = width / 5;
        var heightRect = width / 11;
        bar.append("rect")
            .attr("width", widthRect)
            .attr("height", heightRect)
            .style("fill", "#ffffff")
            .style("stroke-width", 0.5)
            .style("stroke", "rgb(0,0,0)");

        bar.append("text")
            .style("font-size", width / 100)
            .attr("x", width / 150)
            .attr("y", width / 150)
            .attr("dy", "1em")
            .text(a[document.getElementById("axis").value] + ": ");
        if(gcolor!="200") {
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 150)
                .attr("y", width / 150)
                .attr("dy", "2.5em")
                .text(a[gcolor] + ": ");
        }
        else{
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 150)
                .attr("y", width / 150)
                .attr("dy", "2.5em")
                .text("Line: ");
        }
        bar.append("text")
            .style("font-size", width / 100)
            .attr("x", width / 150)
            .attr("y", width / 150)
            .attr("dy", "4em")
            .text(a[historyChoose[i]] + ": ");

        bar.append("text")
            .style("font-size", width / 100)
            .attr("x", width / 150)
            .attr("y", width / 150)
            .attr("dy", "5.5em")
            .text("+/- preDate(%): ");

        bar.append("text")
            .style("font-size", width / 100)
            .attr("x", width / 150)
            .attr("y", width / 150)
            .attr("dy", "7em")
            .text("+/- preWeek(%): ");

        /////////////////////////////////////////////////
        ////////////// values
        var nameAxis;
        var valueAxis;
        var format = d3.format(",f");

        if (!isCombine) {

            if(whatType==0){
                nameAxis = formatdate(parseDate(GGmouse[i][indexmin].values[indexDate[indexmin]].key));
                valueAxis = parseDate(GGmouse[i][indexmin].values[indexDate[indexmin]].key);
            }
            else if(whatType==1){
                nameAxis = GGmouse[i][indexmin].values[indexDate[indexmin]].key;
                valueAxis = GGmouse[i][indexmin].values[indexDate[indexmin]].key;
            }

            else {
                nameAxis = GGmouse[i][indexmin].values[indexDate[indexmin]].key;
                valueAxis = GGmouse[i][indexmin].values[indexDate[indexmin]].key;

            }
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "1em")
                .style("font-weight", "bold")
                .text(nameAxis);
            if(gcolor!="200") {
                bar.append("text")
                    .style("font-size", width / 100)
                    .attr("x", width / 11)
                    .attr("y", width / 150)
                    .attr("dy", "2.5em")
                    .style("font-weight", "bold")
                    .text(GGmouse[i][indexmin].key);
            }
            else{
                bar.append("text")
                    .style("font-size", width / 100)
                    .attr("x", width / 11)
                    .attr("y", width / 150)
                    .attr("dy", "2.5em")
                    .style("font-weight", "bold")
                    .text("Metric");
            }
            var fordate,ratiodate,forweek,ratioweek;
                bar.append("text")
                    .style("font-size", width / 100)
                    .attr("x", width / 11)
                    .attr("y", width / 150)
                    .attr("dy", "4em")
                    .style("font-weight", "bold")
                    .text(format(GGmouse[i][indexmin].values[indexDate[indexmin]].values));
                fordate = Math.round((indexDate[indexmin] - 1) > 0 ? GGmouse[i][indexmin].values[indexDate[indexmin]].values - GGmouse[i][indexmin].values[indexDate[indexmin] - 1].values : 0);
                ratiodate = Math.round((indexDate[indexmin] - 1) > 0 ? fordate * 100 / GGmouse[i][indexmin].values[indexDate[indexmin] - 1].values : 0);
                forweek = Math.round((indexDate[indexmin] - 7) > 0 ? GGmouse[i][indexmin].values[indexDate[indexmin]].values - GGmouse[i][indexmin].values[indexDate[indexmin] - 7].values : 0);
                ratioweek = Math.round((indexDate[indexmin] - 7) > 0 ? forweek * 100 / GGmouse[i][indexmin].values[indexDate[indexmin] - 7].values : 0);

            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "5.5em")
                .style("font-weight", "bold")
                .text(format(fordate) + "(" + ratiodate + "%)");
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "7em")
                .style("font-weight", "bold")
                .text(format(forweek) + "(" + ratioweek + "%)");
            var xtrans;
            var ytrans;

            var trans = focus[i].select("g.y" + historyChoose[i])
            if (gxScale[i](valueAxis) < width - widthRect - distance) {
                xtrans = gxScale[i](valueAxis) + xlocation[i] + 20
            }
            else {
                xtrans = width - widthRect -distance + xlocation[i] + 20;
            }
            if (gyScale[i](GGmouse[i][indexmin].values[indexDate[indexmin]].values) < height - heightRect) {
                ytrans = gyScale[i](GGmouse[i][indexmin].values[indexDate[indexmin]].values) + ylocation[i] + 20;
            }
            else {
                ytrans = height - heightRect + ylocation[i] - heightRect;
            }
            trans.attr("transform",
                "translate(" + xtrans + "," +
                ytrans + ")");
            focus[i].select("circle.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    (gyScale[i](GGmouse[i][indexmin].values[indexDate[indexmin]].values) + ylocation[i]) + ")");
            focus[i].select("line.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    0 + ")");
        }
        else{
            if(whatType==0 ){
                nameAxis = formatdate(parseDate(GGmouse[i][indexmin][indexDate[indexmin]].key));
                valueAxis = parseDate(GGmouse[i][indexmin][indexDate[indexmin]].key);
            }
            else if(whatType==1){
                nameAxis = GGmouse[i][indexmin][indexDate[indexmin]].key;
                valueAxis = GGmouse[i][indexmin][indexDate[indexmin]].key;
            }
           // else if(whatType==5){
           //     nameAxis = formatdate(parseDate(GGmouse[i][indexmin].values[indexDate[indexmin]].key));
           //     valueAxis = parseDate(GGmouse[i][indexmin].values[indexDate[indexmin]].key);
                //nameAxis = GGmouse[i][indexmin].values[indexDate[indexmin]].key
           // }
            else {
                nameAxis = GGmouse[i][indexmin][indexDate[indexmin]].key;
                valueAxis = GGmouse[i][indexmin][indexDate[indexmin]].key;

            }
            selected = $("#lstFruits option:selected");

            name = [];

            selected.each(function () {
                name.push($(this).text());
            });
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "1em")
                .style("font-weight", "bold")
                .text(nameAxis);
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "2.5em")
                .style("font-weight", "bold")
                .text(name[indexmin]);
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "4em")
                .style("font-weight", "bold")
                .text(format(GGmouse[i][indexmin][indexDate[indexmin]].values));
            var fordate = Math.round((indexDate[indexmin] - 1) > 0 ? GGmouse[i][indexmin][indexDate[indexmin]].values - GGmouse[i][indexmin][indexDate[indexmin] - 1].values : 0),
                ratiodate = Math.round((indexDate[indexmin] - 1) > 0 ? fordate * 100 / GGmouse[i][indexmin][indexDate[indexmin] - 1].values : 0),
                forweek = Math.round((indexDate[indexmin] - 7) > 0 ? GGmouse[i][indexmin][indexDate[indexmin]].values - GGmouse[i][indexmin][indexDate[indexmin] - 7].values : 0),
                ratioweek = Math.round((indexDate[indexmin] - 7) > 0 ? forweek * 100 / GGmouse[i][indexmin][indexDate[indexmin] - 7].values : 0);
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "5.5em")
                .style("font-weight", "bold")
                .text(format(fordate) + "(" + ratiodate + "%)");
            bar.append("text")
                .style("font-size", width / 100)
                .attr("x", width / 11)
                .attr("y", width / 150)
                .attr("dy", "7em")
                .style("font-weight", "bold")
                .text(format(forweek) + "(" + ratioweek + "%)");
            var xtrans;
            var ytrans;
            var trans = focus[i].select("g.y" + historyChoose[i])
            if (gxScale[i](valueAxis) < width - widthRect-distance) {
                xtrans = gxScale[i](valueAxis) + xlocation[i] + 20
            }
            else {
                xtrans = width -distance - widthRect + xlocation[i] + 20;
            }
            if (gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) < height - heightRect) {
                ytrans = gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) + ylocation[i] + 20;
            }
            else {
                ytrans = height - heightRect + ylocation[i] - heightRect;
            }
            trans.attr("transform",
                "translate(" + xtrans + "," +
                ytrans + ")");
            focus[i].select("circle.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    (gyScale[i](GGmouse[i][indexmin][indexDate[indexmin]].values) + ylocation[i]) + ")");
            focus[i].select("line.y" + historyChoose[i])
                .attr("transform",
                    "translate(" + (gxScale[i](valueAxis) + xlocation[i]) + "," +
                    0 + ")");
            break;
        }
    }

}