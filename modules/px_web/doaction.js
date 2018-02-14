(function($) {
    'use strict';

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
            tickInterval: 2629746000,
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
                    overflow: false
                }
            },
            series: {
                showInNavigator: true
            }
        }
    };

    Drupal.behaviors.px_web_action = {
        attach(context, settings) {
            
            //Lookup Elements
            let $base =  $(context);
            //Display options
            var displayOptionsLabel = $base.find(".display-options-label");
            var displayOptionsWrapper = $base.find(".display-options-wrapper");
            displayOptionsWrapper.css("display","none");

            displayOptionsLabel.click(function() {
                if(displayOptionsWrapper.css("display") == "none") {
                    displayOptionsWrapper.css("display","block");
                } else {
                    displayOptionsWrapper.css("display","none");
                }
            });

            
            //
            var savedResultText = $base.find(".edit-field-saved-result-text");
            var savedResultElement = $base.find(".edit-field-saved-result");
            let displayOptionsField = $base.find(".edit-field-display-options");
            
            
            var displayOptionsDefaultsButton = savedResultElement.closest('div').parent().find('.load-display-options-default-button');            
            displayOptionsDefaultsButton.html("<a target='_blank' href='#'>Innles standard uppsetan</a>");

            displayOptionsDefaultsButton.click((function(e) {
                e.preventDefault();

                displayOptionsField.val(JSON.stringify(defaultDisplayOptions,0,4));
            }));
            //Build the Load Data button
            var button = savedResultElement.closest('div').parent().find('.load-saved-result-button');            
            button.html("<a target='_blank' href='#'>Innles ella endurinnles dáta</a>");
            button.click(function(e) {
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
                    console.log("NOT " + address);
                    savedResultText.val("");
                }

                return false;
            });

        }
    }
})(jQuery);

