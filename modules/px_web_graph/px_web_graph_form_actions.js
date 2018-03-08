(function($) {
    'use strict';
    
    let isDebug = false;
    
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
            margin: 20
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
                y: -23,
                x: -3,
                text: ""
            },
            lineColor: "#000",
            tickColor: "#000",
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                }
            },
        },
        legend: {
            enabled: true,
            layout: 'horizontal',
            backgroundColor: '#FFFFFF',
            align: 'center',
            verticalAlign: 'top',
            y: -20
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
                    enabled: false
                }
            },
            series: {
                showInNavigator: true
            }
        }
    };

    let defaultMapDisplayOptions = {
        title: {
            text: ''
        },
        subtitle: {
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
        },
        colorAxis: {
            min: 0,
            max: 100,
            type: 'linear',
            minColor: "#FFFFFF",
            maxColor: "#306b34"
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
            data: null,
            mapData: null,
            joinBy: ['label', 0],
            keys: ['label', 'value'],
            name: 'Sýsla',
            states: {
                hover: {
                    color: '#BADA55'
                }
            }
        }]
    };

    Drupal.behaviors.px_web_action = {
        attach(context, settings) {            
            
            log(context);
            log(settings);
            //Lookup Elements
            log("--- Lookup Elements ---");

            //let $base =  $(context);
            let $elements = $(context).find(".field--type-px-web-graph-field-type");

            log($elements);
            $.each($elements,function(index, element) {
                let $base = $(element);
            let displayOptionsLabel = $base.find(".display-options-label");
            let displayOptionsWrapper = $base.find(".display-options-wrapper");
            let displayOptionsField = $base.find(".edit-field-display-options");
            let savedResultText = $base.find(".edit-field-saved-result-text");
            let savedResultElement = $base.find(".edit-field-saved-result");
            let displayOptionsDefaultsButton = savedResultElement.closest('div').parent().find('.load-display-options-default-button');            
            let loadPXDataFromUrlAddressButton = savedResultElement.closest('div').parent().find('.load-saved-result-button');            

            log($base);
            log(displayOptionsLabel);
            log(displayOptionsWrapper);
            log(displayOptionsField);
            log(savedResultText);
            log(savedResultElement);
            log(displayOptionsDefaultsButton);
            log(loadPXDataFromUrlAddressButton);

            //Update elements

            //Update displayOptionsWrapper
            displayOptionsWrapper.css("display","none");
            displayOptionsLabel.click(function() {
                if(displayOptionsWrapper.css("display") == "none") {
                    displayOptionsWrapper.css("display","block");
                } else {
                    displayOptionsWrapper.css("display","none");
                }
            });

            ////Update displayOptionsDefaultsButton
            displayOptionsDefaultsButton.html("<a class='chartDisplayOptionsButton' target='_blank' href='#'>Innles standard <strong>graf</strong> uppsetan</a><br/><a class='mapDisplayOptionsButton' target='_blank' href='#'>Innles standard <strong>landakort</strong> uppsetan</a>");
            displayOptionsDefaultsButton.find(".chartDisplayOptionsButton").click((function(e) {
                e.preventDefault();

                displayOptionsField.val(JSON.stringify(defaultDisplayOptions,0,4));
            }));
            displayOptionsDefaultsButton.find(".mapDisplayOptionsButton").click((function(e) {
                e.preventDefault();

                displayOptionsField.val(JSON.stringify(defaultMapDisplayOptions,0,4));
            }));

            //Update loadPXDataFromUrlAddressButton
            loadPXDataFromUrlAddressButton.html("<a target='_blank' href='#'>Innles ella endurinnles dáta</a>");
            loadPXDataFromUrlAddressButton.click(function(e) {
                e.preventDefault();
                
                var address = savedResultElement.val();
                
                if(address) {

                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function() {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            var px = new Px(xhr.responseText);
                            let text = JSON.stringify(px, null, 4);
                            savedResultText.val(text);
                        }
                    };
                    
                    xhr.open('GET', address);
                    xhr.overrideMimeType('text/xml; charset=iso-8859-15');
                    xhr.send();

                } else {
                    log("NOT " + address);
                    savedResultText.val("");
                }

                return false;
            });

        });
        }
    }

    let log = function(text) {
        if(isDebug)
            console.log(text);
    }
})(jQuery);

