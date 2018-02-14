# PXWeb

## Copy the modules/px_web to the installation

## Set up the theme

Edit the SOMETEMPLATE.libraries.yml
global-js:
  js:
    ...
    js/underscore-min.js: {}   
    js/px.min.js: {}   
    js/storedQueryField.js: {}
	....
	
Add to the bottom of before the body templates\layout\html.html.twig
<script src="https://hagvarp.hagstova.fo/lib/js/highstock-release/highstock.js"></script>
<script src="https://hagvarp.hagstova.fo/lib/js/highstock-release/modules/exporting.js"></script>
