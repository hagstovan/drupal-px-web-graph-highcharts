(function ($, Drupal) {

    let isDebug = true;

    let defaultDisplayOptions = 
    {
        credits: {
            enabled: false
        },
        chart: {
            type: "line",
            backgroundColor: "rgba(255, 255, 255, 0)",
            borderWidth: 0,
            renderTo: "container",
            marginRight: 20
        },
        rangeSelector: {
            enabled: false
        },
        exporting: {
            enabled: false
        },
        navigator: {
            enabled: true
        },
        title: {
            text: ""
        },
        subtitle: {
            text: ""
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
            labels: {
                style: {
                    color: "#000",
                    fontSize: "11px"
                },
            }
        },
        yAxis: {
            title: {
                text: "",
                style: {
                    color: "#000",
                    fontWeight: "normal",
                    fontSize: "12px"
                }
            },
            lineColor: "#000",
            tickColor: "#000",
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                style: {
                    color: "#000",
                    fontSize: "11px"
                }
            },
        },
        legend: {
            enabled: true
        },
        tooltip: {
            enabled: true
        },
        plotOptions: {
            line: {
                marker: {
                    enabled: false,
                },
                dataLabels: {
                    enabled: false
                }
            },
            series: {
                showInNavigator: true
            }
        }
    };

    $(function() {

        if(typeof pxDatas !== 'undefined') {
            pxDatas.forEach(pxData => {
                if(pxData["displayMode"] == 0) {
                    loadPXDataLive(pxData);
                } else {
    
                    renderPXData(pxData);
                }
            });
        }
    });



    var renderPXData = function(pxData) {
        log("-= renderPXData =-");
        log(pxData);   
        
        let storageName = pxData["storageName"];

        //Find element
        let pxPlaceholder = $("." + storageName);
        if(pxData["displayType"] == 0)
        {
            renderGraph(pxData, pxPlaceholder);
        }
        else if(pxData["displayType"] == 1)
        {
            pxPlaceholder.append("Render Table");
        }
        
        else if(pxData["displayType"] == 2)
        {
            renderMap(pxData, pxPlaceholder);
        }
        else
        {
            pxPlaceholder.append("Unknown display type");
        }
    }

    


    var renderMap = function(pxData, pxPlaceholder) {

        log("renderMap");

        //Loading map from Hagvarp (should be stored locally)
        $.getJSON('https://hagvarp.hagstova.fo/syslur7.geo.json', function (geojson) {
           
            var districsMapper = {
                // "Norðstreymoyar sýsla" : 'Nordstreymoyar',
                // "Suðurstreymoyar sýsla" : 'Sudurstreymoyar',
                "Streymoyar sýsla" : "Streymoyar",
                "Suðuroyar sýsla" : 'Suduroyar',
                "Sandoyar sýsla" : 'Sandoyar',
                "Vága sýsla" : 'Vaga',
                "Eysturoyar sýsla" : 'Eysturoyar',
                "Norðoya sýsla" : 'Nordoya' ,

                "Norðstreymoyar øki" : 'Nordstreymoyar',
                "Suðurstreymoyar øki" : 'Sudurstreymoyar',
                "Suðuroyar øki" : 'Suduroyar',
                "Sandoyar øki" : 'Sandoyar',
                "Vága øki" : 'Vaga',
                "Eysturoyar øki" : 'Eysturoyar',
                "Norðoya øki" : 'Nordoya' 
            };

            let savedResultText = pxData["savedResultText"];
            
            if(!savedResultText["data"] || !savedResultText["metadata"])
            {
                pxPlaceholder.append("<h2>Kann ikki vísa. Onki 'úrslit' funni</h2>");
                pxPlaceholder.append("<p>Fyri at loysa hendan trupulleikan, kanst tú fara inn á Edit og trýst á 'Innles ella endurinnles dáta'</p>");
                return;
            }

            let metadata = savedResultText["metadata"];
            //let districts = metadata["CODES"]["district of residence"];

            let stub = metadata["STUB"]["TABLE"];
            log(stub);            
            let districts = metadata["VALUES"][stub];

            let minValue = 99999999999;
            let maxValue = 0;
            let data = [];
            for(var i = 0; i < districts.length; i++) {
                let serie = [];

                let mappedDisctrict = districsMapper[districts[i]];

                if(mappedDisctrict !== undefined)
                {
                    let dataValue = savedResultText["data"][i];

                    if(minValue > dataValue)
                        minValue = dataValue;
                    if(maxValue < dataValue)
                        maxValue = dataValue;

                    data.push([mappedDisctrict, dataValue]);
                } else {
                    log("Can not map disctrict " + districts[i]);
                }
            }

            //Render the Map
            pxPlaceholder.highcharts('Map', {
                title: {
                      text: ''
                  },
                credits: {
                    enabled: false
                  },
                chart: {
                    backgroundColor: "rgba(255, 255, 255, 0)",
                },
                exporting: {
                    enabled: false
                },                              
                  legend: {
                    enabled: false,
                      title: {
                          text: "Arbeiðsfjøldin (%) í mun til fólkatalið"
                      }
                    },
                colorAxis: {
                        min: minValue,
                        max: maxValue,
                      type: 'linear',
                      minColor: "#ffffff",
                      maxColor: "#002d62"//"#f7b538"
                  },
                  tooltip: {
                          valueDecimals: 1,
                          valueSuffix: '',
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
                    data: data,
                      mapData: geojson,
                      joinBy: ['name', 0],
                      keys: ['name', 'value'],
                      name: 'Sýsla',
                      states: {
                          hover: {
                              color: '#BADA55'
                          }
                      }
                  }]
                 
              });
        });
    }

        


    var renderGraph = function(pxData, pxPlaceholder) {

        // ------------------------------------------- //
        //                LOOKUP VALUES                //
        // ------------------------------------------- //
        log("-= Lookup SavedResultText =-");
        let savedResultText = pxData["savedResultText"];
        log(savedResultText);   

        if(!savedResultText["data"] || !savedResultText["metadata"])
        {
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
        let headings = metadata["HEADING[fo]"]["TABLE"];
        let values = metadata["VALUES[fo]"];

        let timeValueTypes = Object.keys(timeVal); 
        let timeValueType = timeValueTypes[0];

        let firstHeading = headings;
        if(Array.isArray(headings))
            firstHeading = headings[0];

        if(timeValueType != firstHeading) {
            timeValueType = firstHeading;
        }
            
        let timeValues = values[timeValueType];

        //We need to interate headings and check values for each her
        
        log(headings);
        log(values);
        log(timeVal);
        log(timeValueTypes);
        log(timeValueType);
        log(timeValues);

        //Find Series (groups)  
        log("-= Find Series (groups) =-");
        let stub = null;
        
        if(metadata["STUB[fo]"] != null)
            stub = metadata["STUB[fo]"]["TABLE"];

        let series = [];

        //Try and join all stubs to individual series
        let stubsToCheck = [];
        if(!Array.isArray(stub))
            stubsToCheck = [ stub ];
        else 
            stubsToCheck = stub.splice(0);

        stubsToCheck.forEach(element => {        
            let partialSeries = metadata["VALUES[fo]"][element];
            let semiSeries = series.slice();
            series = [];
            if(semiSeries.length > 0) {
                semiSeries.forEach(element2 => {
                    if(Array.isArray(partialSeries)) {
                        partialSeries.forEach(element3 => {
                            series.push(element2 + " - " + element3);
                        });
                    } else {
                        series.push(element2 + " - " + partialSeries);
                    }
                });
            } else {
                if(Array.isArray(partialSeries)) {
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
        let colors =  ["#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169', "#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169'];
        if(pxData["seriesColor"]) {
            var arrayOfColors = pxData["seriesColor"].split(",");
            for(var i  = 0; i< arrayOfColors.length; i++) {
                if(arrayOfColors[i].length > 0)
                {
                    if(colors.length <= i) {
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
        if(pxData["seriesNames"]) {
            var arrayOfSeriesNames = pxData["seriesNames"].split(",");
            seriesNames = arrayOfSeriesNames;
        }
        log(seriesNames);

        //Process Data
        log("-= Process Data =-");
        let isCategory = false;
        let processedData = [];
        let tickIntervalToUse = defaultDisplayOptions.xAxis.tickInterval;

        for(var j = 0; j < series.length; j++) {
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
            if(seriesNames.length > j && seriesNames[j].length > 0)
                serie.name = seriesNames[j] 
            else 
                serie.name = currentSeries;

            //Set Series Color
            if(colors.length > j && colors[j].length > 0)
                serie.color = colors[j] 
            else 
                serie.color = "#002d62";

            

            for(var i = 0; i < timeValues.length; i++) {
                let timeValue = timeValues[i];
                
                let time = timeValue;
                if(timeValue.indexOf("M") > -1) {
                    time = timeValue.replace("M","-");
                    tickIntervalToUse = 24 * 3600 * 1000 * 25;
                }
                
                let date = Date.parse(time);

                if(!isNaN(date)) {
                    if(min > date)
                        min = date;
                    if(date > max)
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
        if(displayOptions != null && Object.keys(displayOptions).length > 0) {
            highchartsOptions = displayOptions;
        }

        //Overwrite display options
        if(highchartsOptions.xAxis.min == 0)
            highchartsOptions.xAxis.min = min;

        if(highchartsOptions.xAxis.max == 0)
            highchartsOptions.xAxis.max = max;

        highchartsOptions.title.text = pxData.title;
        highchartsOptions.subtitle.text = pxData.subtitle;
        highchartsOptions.series = processedData;
        log(tickIntervalToUse);
        log(highchartsOptions.xAxis.tickInterval);
        highchartsOptions.xAxis.tickInterval = tickIntervalToUse;
        
        if(pxData["yAxisName"])
            highchartsOptions.yAxis.title.text = pxData["yAxisName"];

        if(isCategory) {       
            highchartsOptions.xAxis.min= null;
            highchartsOptions.xAxis.max= null;
            highchartsOptions.xAxis.type= "linear";
            highchartsOptions.navigator.enabled = false;
            highchartsOptions.xAxis.categories = timeValues;
            highchartsOptions.xAxis.tickInterval = null;
        }

        pxPlaceholder.highcharts(highchartsOptions);
    }

    var loadPXDataLive = function(pxData) { 
        
        let address = pxData["savedResultUrl"]
        if(address) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
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

    var log = function(text) {
        if(isDebug)
        console.log(text);
    }
})(window.jQuery, window.Drupal);