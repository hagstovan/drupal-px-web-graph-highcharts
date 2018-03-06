# PX Web Graph (Highcharts)

# Modular Requirements
- entity_reference_revisions (https://www.drupal.org/project/entity_reference_revisions)
- paragraphs (https://www.drupal.org/project/paragraphs)

# Installation
## Copy the modules/px_web_graph to the installation

copy the folder modules\px_web_graph to your DRUPALINSTALLATION\modules

## Set up the theme

Edit the SOMETEMPLATE.libraries.yml

```
global-js:
  js:
    ...
    js/underscore-min.js: {}   
    js/px.min.js: {}   
    js/pxWebGraphField.js: {}
	....
```

Add to the bottom of before the body templates\layout\html.html.twig
```
<script src="https://hagvarp.hagstova.fo/lib/js/highstock-release/highstock.js"></script>
<script src="https://hagvarp.hagstova.fo/lib/js/highstock-release/modules/exporting.js"></script>

<script src="https://hagvarp.hagstova.fo/lib/js/highmaps-release/modules/map.js"></script>   
<script src="https://hagvarp.hagstova.fo/lib/js/highmaps-release/modules/data.js"></script>
<script src="https://hagvarp.hagstova.fo/lib/js/highmaps-release/modules/exporting.js"></script>
```

Add the block template:

copy file "themes\THEMENAME\templates\blocks\field--px-web-graph-field-type.html" to your DRUPALINSTALLATION\themes\YOURTHEMENAME\templates\blocks\ folder 

# How to set up a paragraphs
Pre: Install paragraphs and entity reference revisions

1. Login
2. Click extend
3. Find Paragraphs and expand "Enables the creation of paragraphs entities."
4. Click Configure
5. Click Add paragraph type
5.1 Set a label that makes sense (i.e Theme Block)
5.2 Optionally add a icon and description
6. Click add Field
7. Under Add a new field type. Find a field you want (i.e. Stored query field type)
7.1 NB! If using an existing field type then try and find it under "re-use and existing field"
7.2 If creating a new field then set label to something pretty (i.e. PX Data Link Grouped)
8. Setup default values that should be show for this field type (i.e. in PXWeb we want to have Grafur selected by default)

9. If you want to add an other field then go to 6.

