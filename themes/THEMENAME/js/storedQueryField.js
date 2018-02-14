(function ($, Drupal) {

    let defaultDisplayOptions = {
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
            enabled: true
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
            tickInterval: 2629746000,
            min: 0,
            max: 1,
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
                text: "Test",
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
                    enabled: true,
                    color: "#000",
                    useHTML: true,
                    crop: false,
                    overflow: false,
                    formatter: function() {
                        var last  = this.series.data[this.series.data.length - 1];
                        if (this.point.category === last.category  && this.point.y === last.y) {
                            return ('<div class="MyDataLabelTooltip"><span class="datetext">' +  Highcharts.dateFormat("%e. %b &apos;%y",this.point.x + 43200000) + "</span><br />" +  Highcharts.numberFormat(this.point.y,0)  + "</div>");
                        }
                        else {return};
                        }
                    }
                },
            series: {
                showInNavigator: true
            }
        }
    };

    $(function() {
        if(pxData === undefined) {
            alert("NO PX DATA FOUND ON PAGE");
            return;
        }

        if(pxData["displayMode"] == 0) {
            loadPXDataLive(pxData["savedResultUrl"]);
        } else {
            renderPXData(pxData);
        }
    });

    var renderPXData = function(pxData) {
        console.log("-= renderPXData =-");
        console.log(pxData);   

        //Find element
        let pxPlaceholder = $(".pxPlaceholder");

        // ------------------------------------------- //
        //                LOOKUP VALUES                //
        // ------------------------------------------- //
        console.log("-= Lookup SavedResultText =-");
        let savedResultText = pxData["savedResultText"];
        console.log(savedResultText);   

        console.log("-= Lookup displayOptions =-");
        let displayOptions = pxData["displayOptions"];
        console.log(displayOptions);   

        let data = savedResultText["data"];
        let metadata = savedResultText["metadata"];

        //Find time values (X-Axis)
        console.log("-= Find time values (X-Axis) =-");
        let timeVal = metadata["TIMEVAL[fo]"];
        let timeValueTypes = Object.keys(timeVal); 
        let timeValueType = timeValueTypes[0];
        let timeValues = metadata["VALUES[fo]"][timeValueType];

        console.log(timeVal);
        console.log(timeValueTypes);
        console.log(timeValueType);
        console.log(timeValues);

        //Find Series (groups)  
        console.log("-= Find Series (groups) =-");
        let stub = metadata["STUB[fo]"]["TABLE"];

        let series = [];

        //Try and join all stubs to individual series
        stub.forEach(element => {        
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

        console.log(stub);
        console.log(series);

        //Find values
        let min = 9999999999999;
        let max = 0;

        //Find Colors
        console.log("-= Find Colors =-");
        let colors =  [];
        if(pxData["seriesColor"]) {
            var arrayOfColors = pxData["seriesColor"].split(",");
            colors = arrayOfColors;
        }
        console.log(colors);

        //Find Series Names
        console.log("-= Find Series Names =-");
        let seriesNames = [];
        if(pxData["seriesNames"]) {
            var arrayOfSeriesNames = pxData["seriesNames"].split(",");
            seriesNames = arrayOfSeriesNames;
        }
        console.log(seriesNames);

        //Process Data
        console.log("-= Process Data =-");
        let processedData = [];
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
                let time = timeValue.replace("M","-");
                let date = Date.parse(time);

                if(min > date)
                    min = date;
                if(date > max)
                    max = date;

                serie.data.push([date, parseFloat(data[i + (timeValues.length * j)])]);
            }

            processedData.push(serie)
        }
        console.log(processedData);

        let highchartsOptions = defaultDisplayOptions;
        if(displayOptions.length > 0) {
            highchartsOptions = displayOptions;
        }

        //Overwrite display options
        highchartsOptions.xAxis.min = min;
        highchartsOptions.xAxis.max = max;
        highchartsOptions.title.text = pxData.title;
        highchartsOptions.subtitle.text = pxData.subtitle;
        highchartsOptions.series = processedData;

        pxPlaceholder.highcharts(highchartsOptions);
    }

    var loadPXDataLive = function(address) {   
        if(address) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var px = new Px(xhr.responseText);
                    pxData["savedResultUrl"] = px;
                    renderPXData(pxData);
                }
            };
            
            xhr.open('GET', address);
            xhr.overrideMimeType('text/xml; charset=iso-8859-15');
            xhr.send();
        }
    }
})(window.jQuery, window.Drupal);