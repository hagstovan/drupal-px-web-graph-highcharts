# PXWeb

## Copy the modules/px_web to the installation

copy the folder modules\px_web to your DRUPALINSTALLATION\modules

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
