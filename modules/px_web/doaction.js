(function($) {
    'use strict';

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

