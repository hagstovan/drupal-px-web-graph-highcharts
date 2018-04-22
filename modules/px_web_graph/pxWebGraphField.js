(function ($, Drupal) {

    let isDebug = true;

    let defaultDisplayOptions = {
        credits: {
            enabled: false
        },
        chart: {
            type: "line",
            spacing: [50, 30, 50, 30]
        },
        rangeSelector: {
            enabled: false
        },
        exporting: {
            buttons: {
                contextButton: {
                    y: -10
                }
            }
        },
        navigator: {
            enabled: true
        },
        title: {
            text: "",
            align: 'left', 			     
            y: 0,
            margin: 40
        },
        subtitle: {
            text: "",
            align: 'left',
            y: 22 
        },
        legend: {
            layout: "horizontal",
            align: "center",
            verticalAlign: "top",
            itemStyle: {
                color: "#000",
                fontWeight: "normal"
            }
        },
        xAxis: {
            title: {
                enabled: false
            },
            tickInterval: 24 * 3600 * 1000 * 360,
            min: 0,
            max: 0,
            type: "datetime",
            reversed: false,
            labels: {
                style: {
                    color: "#000",
                    fontSize: "11px"
                },
            }
        },
        yAxis: {
            title: {
                align: 'high',
                offset: 0,
                rotation: 0,
                y: -25,
                x: 0,
                text: ""
            },
            lineColor: "#000",
            tickColor: "#000",
            labels: {
            }
        },
        legend: {
            enabled: true,
            layout: 'horizontal',
            backgroundColor: '#FFFFFF',
            align: 'center',
            verticalAlign: 'top',
            y: 40
        },
        tooltip: {
            enabled: true,
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false,
                },
                dataLabels: {
                    enabled: false,   
                }
            },
            series: {
                showInNavigator: true
            }
        }
    };

    let defaultMapDisplayOptions = {
        title: {
            text: '',

        },
        subtitle: {
            text: '',
        },
        credits: {
            enabled: false
        },
        chart: {
            backgroundColor: "rgba(255, 255, 255, 0)",
            spacing: [30, 30, 30, 30]            
        },
        exporting: {
            enabled: false
        },
        legend: {
            enabled: false,
        },
        colorAxis: {
            min: 0,
            max: 100,
            type: 'linear',
            minColor: "#FFFFFF",
            maxColor: "#306b34"
        },
        tooltip: {
             pointFormat: '{point.readableName}: {point.value:.1f}'
        },
        plotOptions: {
            map: {
                dataLabels: {
                    enabled: true,
                    format: '{point.value:.1f}',
                    className: 'MyDataLabelTooltip',
                    style: { fontSize: '1.6em !important' }
                }
            }
        },
        series: [{
            data: null,
            mapData: null,
            joinBy: 'label',
            keys: ['label', 'value', 'readableName'],
            name: 'Sýsla',
            states: {
                hover: {
                    color: '#BADA55'
                }
            }
        }]
    };

    $(function () {

        if (typeof pxDatas !== 'undefined') {
            pxDatas.forEach(pxData => {
                if (pxData["displayMode"] == 0) {
                    loadPXDataLive(pxData);
                } else {

                    renderPXData(pxData);
                }
            });
        }
    });

    var getDefaultDisplayOptions = function() {
        return JSON.parse(JSON.stringify(defaultDisplayOptions));
    }

    var getDefaultMapDisplayOptions = function() {
        return JSON.parse(JSON.stringify(defaultMapDisplayOptions));
    }

    var renderPXData = function (pxData) {
        log("-= renderPXData =-");
        log(pxData);

        let storageName = pxData["storageName"];

        //Find element
        let pxPlaceholder = $("." + storageName);
        if (pxData["displayType"] == 0) {
            renderGraph(pxData, pxPlaceholder);
        }
        else if (pxData["displayType"] == 1) {
            pxPlaceholder.append("Render Table");
        }

        else if (pxData["displayType"] == 2) {
            renderMap(pxData, pxPlaceholder);
        }
        else {
            pxPlaceholder.append("Unknown display type");
        }
    }

    //Sýslir
    var getDistrictsJsonUrl = function() {
        return "https://hagvarp.hagstova.fo/utm.districts.geo.json";
    }

    var getRegionsJsonUrl = function() {
        return "https://hagvarp.hagstova.fo/utm.regions.geo.json";
    }


    var renderMap = function (pxData, pxPlaceholder) {
        var districsMapper = {
            "Streymoyar sýsla": "Streymoyar",
            "Suðuroyar sýsla": 'Suduroyar',
            "Sandoyar sýsla": 'Sandoyar',
            "Vága sýsla": 'Vaga',
            "Eysturoyar sýsla": 'Eysturoyar',
            "Norðoya sýsla": 'Nordoya',

            "Norðstreymoyar øki": 'Nordstreymoyar',
            "Suðurstreymoyar øki": 'Sudurstreymoyar',
            "Suðuroyar øki": 'Suduroyar',
            "Sandoyar øki": 'Sandoyar',
            "Vága øki": 'Vaga',
            "Eysturoyar øki": 'Eysturoyar',
            "Norðoya øki": 'Nordoya'
        };

        let savedResultText = pxData["savedResultText"];

        if (!savedResultText["data"] || !savedResultText["metadata"]) {
            pxPlaceholder.append("<h2>Kann ikki vísa. Onki 'úrslit' funni</h2>");
            pxPlaceholder.append("<p>Fyri at loysa hendan trupulleikan, kanst tú fara inn á Edit og trýst á 'Innles ella endurinnles dáta'</p>");
            return;
        }

        let metadata = savedResultText["metadata"];

        let stub = null;
        if(metadata["STUB[fo]"])
            stub = metadata["STUB[fo]"]["TABLE"];
        else if(metadata["STUB"])
            stub = metadata["STUB"]["TABLE"];

        let values = null;
        if (metadata["VALUES[fo]"])
            values = metadata["VALUES[fo]"];
        else if (metadata["VALUES"])
            values = metadata["VALUES"];

        let districts = null;
        if (values)
            districts = values[stub];

        let timeVal = metadata["TIMEVAL[fo]"];
        if (!timeVal)
            timeVal = metadata["TIMEVAL"];

        let timeValueTypes = null;
        if (timeVal)
            timeValueTypes = Object.keys(timeVal);

        let timeValues = null;
        if (values && timeValueTypes.length > 0)
            timeValues = values[timeValueTypes[0]];
        if (timeValues && !Array.isArray(timeValues))
            timeValues = [timeValues];
        
        //values
        let titleToAppend = "";
        if (timeValues && timeValues.length == 1) {
            let firstTimeVal = timeValues[0];
            let time = firstTimeVal;
            if (firstTimeVal.indexOf("M") > -1) {
                time = firstTimeVal.replace("M", "-");
            }

            let parsedDate = Date.parse(time);
            if(!isNaN(parsedDate)) {
                if (firstTimeVal.indexOf("M") > -1) {
                    titleToAppend = " " + Highcharts.dateFormat("%b %Y", parsedDate)
                } else {
                    titleToAppend = " " + Highcharts.dateFormat("%Y", parsedDate)
                }   
            }
        }

        

        let isDistricsMap = true;
        let minValue = 99999999999;
        let maxValue = 0;
        let data = [];
        for (var i = 0; i < districts.length; i++) {
            let serie = [];

            let disctrictName = districts[i];

            if(isDistricsMap && disctrictName.indexOf("øki") != -1) {
                isDistricsMap = false;
            }


            let mappedDisctrict = districsMapper[disctrictName];

            if (mappedDisctrict !== undefined) {
                let dataValue = savedResultText["data"][i];

                if (minValue > Number(dataValue)) {
                    minValue = dataValue;
                }
                if (maxValue < Number(dataValue)) {
                    maxValue = dataValue;
                }

                data.push([mappedDisctrict, dataValue, disctrictName]);
            } else {
                log("Can not map disctrict " + disctrictName);
            }
        }

        var jsonUrlToUse = getDistrictsJsonUrl();
        if(!isDistricsMap)
            jsonUrlToUse = getRegionsJsonUrl();

        //Loading map from Hagvarp (should be stored locally)
        $.getJSON(jsonUrlToUse, function (geojson) {
            
            //Set displayOptions
            let displayOptions = pxData["displayOptions"];    
            if (displayOptions == null || Object.keys(displayOptions).length == 0) {
                displayOptions = getDefaultMapDisplayOptions();
            }

            //Overwrite display options
            displayOptions.title.text = pxData.title + " " + titleToAppend;
            displayOptions.subtitle.text = pxData.subtitle;
            displayOptions.colorAxis.min = minValue;
            displayOptions.colorAxis.max = maxValue;
            displayOptions.series[0].data = data;
            displayOptions.series[0].name = isDistricsMap ? "Sýsla" : "Øki";
            displayOptions.series[0].mapData = geojson;


            

            log(displayOptions);
            
            //Render the Map
            pxPlaceholder.highcharts('Map', displayOptions);
        });
    }

    var renderGraph = function (pxData, pxPlaceholder) {

        // ------------------------------------------- //
        //                LOOKUP VALUES                //
        // ------------------------------------------- //
        log("-= Lookup SavedResultText =-");
        let savedResultText = pxData["savedResultText"];
        log(savedResultText);

        if (!savedResultText["data"] || !savedResultText["metadata"]) {
            pxPlaceholder.append("<h2>Kann ikki vísa. Onki 'úrslit' funni</h2>");
            pxPlaceholder.append("<p>Fyri at loysa hendan trupulleikan, kanst tú fara inn á Edit og trýst á 'Innles ella endurinnles dáta'</p>");
            return;
        }


        log("-= Lookup displayOptions =-");
        let displayOptions = pxData["displayOptions"];
        log(displayOptions);

        let data = savedResultText["data"];
        let metadata = savedResultText["metadata"];

        //Find time values (X-Axis)
        log("-= Find time values (X-Axis) =-");
        let timeVal = metadata["TIMEVAL[fo]"];
        if(!timeVal)
            timeVal = metadata["TIMEVAL"];

        let heading = metadata["HEADING[fo]"];
        if(!heading)
            heading = metadata["HEADING"];
        let headings = heading["TABLE"];

        let values = metadata["VALUES[fo]"];
        if(!values)
            values = metadata["VALUES"];

        let timeValueTypes = null;
        let timeValueType = null;
        if(timeVal) {
            timeValueTypes = Object.keys(timeVal);
            timeValueType = timeValueTypes[0];
        }
        
        let firstHeading = headings;
        if (Array.isArray(headings))
            firstHeading = headings[0];

        if (timeValueType != firstHeading) {
            timeValueType = firstHeading;
        }

        let timeValues = values[timeValueType];

        //We need to interate headings and check values for each her
        log("-- headings");
        log(headings);
        log("-- values");
        log(values);
        log("-- timeVal");
        log(timeVal);
        log("-- timeValueTypes");
        log(timeValueTypes);
        log("-- timeValueType");
        log(timeValueType);
        log("-- timeValues");
        log(timeValues);

        //Find Series (groups)  
        log("-= Find Series (groups) =-");
        let stub = null;

        if (metadata["STUB[fo]"])
            stub = metadata["STUB[fo]"]["TABLE"];
        else if(metadata["STUB"])
            stub = metadata["STUB"]["TABLE"];

        let series = [];

        //Try and join all stubs to individual series
        let stubsToCheck = [];
        if (!Array.isArray(stub))
            stubsToCheck = [stub];
        else
            stubsToCheck = stub.splice(0);

        stubsToCheck.forEach(element => {        
            let partialSeries = values[element];
            let semiSeries = series.slice();
            series = [];
            if (semiSeries.length > 0) {
                semiSeries.forEach(element2 => {
                    if (Array.isArray(partialSeries)) {
                        partialSeries.forEach(element3 => {
                            series.push(element2 + " - " + element3);
                        });
                    } else {
                        series.push(element2 + " - " + partialSeries);
                    }
                });
            } else {
                if (Array.isArray(partialSeries)) {
                    partialSeries.forEach(element2 => {
                        series.push(element2);
                    });
                } else {
                    series.push(partialSeries);
                }
            }
        });

        log(stub);
        log(series);

        //Find values
        let min = 9999999999999;
        let max = 0;

        
        //Find Colors
        log("-= Find Colors =-");
        let colors = ["#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169', "#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169'];
        if (pxData["seriesColor"]) {
            var arrayOfColors = pxData["seriesColor"].split(",");
            for (var i = 0; i < arrayOfColors.length; i++) {
                if (arrayOfColors[i].length > 0) {
                    if (colors.length <= i) {
                        colors.push(arrayOfColors[i]);
                    } else {
                        colors[i] = arrayOfColors[i];
                    }
                }

            }
        }
        log(colors);

        //Find Series Names
        log("-= Find Series Names =-");
        let seriesNames = [];
        if (pxData["seriesNames"]) {
            var arrayOfSeriesNames = pxData["seriesNames"].split(",");
            seriesNames = arrayOfSeriesNames;
        }
        log(seriesNames);

        let seriesType = [];
        if (pxData["seriesType"]) {
            seriesType = pxData["seriesType"].split(",").map(function (item) {
                return item.trim();
            });
        }

        let legendsVisibility = [];
        if (pxData["legendsVisibility"]) {
            legendsVisibility = pxData["legendsVisibility"].split(",").map(function (item) {
                return item.trim();
            });
        }

        //Process Data

        let defaultDisplayOptions = getDefaultDisplayOptions();

        log("-= Process Data =-");
        let isCategory = false;
        let processedData = [];
        let tickIntervalToUse = defaultDisplayOptions.xAxis.tickInterval;

        //for (var j = series.length - 1; j > 0; j--) {
        for (var j = 0; j < series.length; j++) {
            let currentSeries = series[j];
            let serie = {
                data: [],
                color: colors[j],
                borderWidth: 0,
                tooltip: {
                    valueDecimals: 0
                }
            }

            //Set Series Name
            if (seriesNames.length > j && seriesNames[j].length > 0)
                serie.name = seriesNames[j]
            else
                serie.name = currentSeries;

            //Set Series Color
            if (colors.length > j && colors[j].length > 0)
                serie.color = colors[j]
            else
                serie.color = "#002d62";

            //Set Series Type
            if (seriesType.length > j && seriesType[j].length > 0)
                serie.type = seriesType[j]

            //Set Visibility
            if (legendsVisibility.length > j && legendsVisibility[j].length > 0) {
                if (legendsVisibility[j] == "0")
                    serie.visible = false;
                else if (legendsVisibility[j] == "-1")
                    serie.showInLegend = false;
            }

            for (var i = 0; i < timeValues.length; i++) {
                let timeValue = timeValues[i];

                let time = timeValue;
                if (timeValue.indexOf("M") > -1) {
                    time = timeValue.replace("M", "-");
                    tickIntervalToUse = 24 * 3600 * 1000 * 25;
                }

                let date = Date.parse(time);

                if (!isNaN(date)) {
                    if (min > date)
                        min = date;
                    if (date > max)
                        max = date;

                    serie.data.push([date, parseFloat(data[i + (timeValues.length * j)])]);
                } else {
                    isCategory = true;
                    serie.data.push([timeValue, parseFloat(data[i + (timeValues.length * j)])]);
                }
            }

            processedData.push(serie)
        }
        log(processedData);

        let highchartsOptions = defaultDisplayOptions;
        if (displayOptions != null && Object.keys(displayOptions).length > 0) {
            highchartsOptions = displayOptions;
        }

        //Overwrite display options
        if (highchartsOptions.xAxis.min == 0)
            highchartsOptions.xAxis.min = min;

        if (highchartsOptions.xAxis.max == 0)
            highchartsOptions.xAxis.max = max;

        highchartsOptions.title.text = pxData.title;
        highchartsOptions.subtitle.text = pxData.subtitle;
        highchartsOptions.series = processedData;
        log(tickIntervalToUse);
        log(highchartsOptions.xAxis.tickInterval);
        highchartsOptions.xAxis.tickInterval = tickIntervalToUse;

        //Show last dataLabel in chart
        highchartsOptions.plotOptions.line.dataLabels = {
            enabled: true,
            color: "#FFF",
            useHTML: true,
            crop: false,
            overflow: false,
            formatter: function () {
                var last = null;
                for (var i = this.series.data.length - 1; i > 0; i--) {
                    if (!isNaN(this.series.data[i].y)) {
                        last = this.series.data[i];
                        break;
                    }
                }
                
                if (last !== null && this.point.category === last.category && this.point.y === last.y) {

                    var label = '<div class="MyDataLabelTooltip">' +
                        '<span class="datetext">';

                    if (isCategory) {
                        label += this.point.x;
                    } else {Highcharts.
                        label += Highcharts.dateFormat("%b &apos;%y", this.point.x);
                    }

                    label += "</span><br />" +
                        Highcharts.numberFormat(this.point.y, 0) +
                        "</div>"

                    return label;
                }
                return;
            }
        };
        log(processedData);

        if(processedData.length < 2)
            highchartsOptions.legend.enabled = false;
        else if(processedData.length > 4) {
            highchartsOptions.legend.align = 'right';
            highchartsOptions.legend.verticalAlign = 'top';
            highchartsOptions.legend.layout = 'vertical';
            highchartsOptions.legend.align = 'right';
            highchartsOptions.legend.x = 0;
            highchartsOptions.legend.y = 100;
        }

        if(pxData.sortDirection == 1)
            highchartsOptions.legend.reversed = true;

        if (pxData["yAxisName"])
            highchartsOptions.yAxis.title.text = pxData["yAxisName"];

        
        highchartsOptions.yAxis.labels.formatter = function() {
            return Highcharts.numberFormat(this.value, 0);
        };

        if (isCategory) {
            highchartsOptions.xAxis.min = null;
            highchartsOptions.xAxis.max = null;
            highchartsOptions.xAxis.type = "linear";
            highchartsOptions.navigator.enabled = false;
            highchartsOptions.xAxis.categories = timeValues;
            highchartsOptions.xAxis.tickInterval = null;
        } 

        

        //Append the date to the title if only one date
        if (timeValueTypes && timeValueTypes.length > 0) {
            let innerTimeVal = timeValueTypes[0];

            let firstTimeVal = values[innerTimeVal];

            let time = firstTimeVal;
            if (firstTimeVal.indexOf("M") > -1) {
                time = firstTimeVal.replace("M", "-");
            }

            let parsedDate = Date.parse(time);
            if (!isNaN(parsedDate)) {
                if (firstTimeVal.indexOf("M") > -1) {
                    highchartsOptions.title.text += " " + Highcharts.dateFormat("%b %Y", parsedDate)
                } else {
                    highchartsOptions.title.text += " " + Highcharts.dateFormat("%Y", parsedDate)
                }
            }
        }

        pxPlaceholder.highcharts(highchartsOptions);
    }

    var loadPXDataLive = function (pxData) {

        let address = pxData["savedResultUrl"]
        if (address) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var px = new Px(xhr.responseText);
                    pxData["savedResultText"] = px;
                    renderPXData(pxData);
                }
            };

            xhr.open('GET', address);
            xhr.overrideMimeType('text/xml; charset=iso-8859-15');
            xhr.send();
        }
    }

    var log = function (text) {
        if (isDebug)
            console.log(text);
    }
})(window.jQuery, window.Drupal);