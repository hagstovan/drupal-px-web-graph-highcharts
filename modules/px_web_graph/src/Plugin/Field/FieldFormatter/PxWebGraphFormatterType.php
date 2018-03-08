<?php

namespace Drupal\px_web_graph\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

use Drupal\px_web_graph\Utilities;
use implode;
use stdClass;
/**
 * Plugin implementation of the 'px_web_graph_formatter_type' formatter.
 *
 * @FieldFormatter(
 *   id = "px_web_graph_formatter_type",
 *   label = @Translation("PX Web Graph (Highcharts) formatter type"),
 *   field_types = {
 *     "px_web_graph_field_type"
 *   }
 * )
 */
class PxWebGraphFormatterType extends FormatterBase {

  public static $currentId;

  public static function getNextId() {
    PxWebGraphFormatterType::$currentId += 1;
      return PxWebGraphFormatterType::$currentId;
  }

  /**
   * {@inheritdoc}
   */
  public function viewElements(FieldItemListInterface $items, $langcode) {

    foreach ($items as $delta => $item) {

      //Parsing the data
      // $utilities = new Utilities();

      // //Check if need to request px file from server
      // if($item->displayMode == 0) {
      //   $pxFile = $utilities->getPxFile($item->savedResultUrl);
        
      //   //Convert to json data
      //   $timeValues = $pxFile->keyword("TIMEVAL");

        
        

      //   $headings = $pxFile->keyword("HEADING");
      //   $values = $pxFile->keyword("VALUES");
      //   $stubs = $pxFile->keyword("STUB");

      //   //Find time value
      //   $timeValueType = $timeValues->subKeys[0];
      //   if(is_array($headings->values)) {
      //     if($headings->values[0] != $timeValueType)
      //       $timeValueType = $headings->values[0];
      //   }

      //   //Find time values
      //   $timeValuesElements = $timeValues->values;
      //   var_dump($timeValuesElements);
      //   echo "<br/><br/>";

      //   //data
      //   $data = $pxFile->data();

      //   //Find time values (X-Axis)
      //   echo "timeValues<br/>";
      //   var_dump($timeValues);
      //   echo "<br/><br/>";

      //   echo "headings<br/>";
      //   var_dump($headings);
      //   echo "<br/><br/>";

      //   echo "values<br/>";
      //   var_dump($values);
      //   echo "<br/><br/>";

      //   echo "stubs<br/>";
      //   var_dump($stubs);
      //   echo "<br/><br/>";

      //   // $series = [];
      //   // for($i = 0; $i < count($stubs); $i++) {
      //   //   $series = $foundValues;
      //   // }

      //   //var_dump($series);
      // }

      //Original
      $elements = array();
      $markup = "";
      $markup .= "<strong>displayMode:</strong> " . $item->displayMode . "<br/>";
      $markup .= "<strong>savedResultUrl:</strong> " . $item->savedResultUrl . "<br/>";
      $markup .= "<strong>savedResultText:</strong> <code>" . $item->savedResultText . "</code><br/>";
      $markup .= "<strong>displayOptions:</strong> " . $item->displayOptions . "<br/>";


      $id = PxWebGraphFormatterType::getNextId();

      $storageName = "pxPlaceholder".$id;
      $elements[$delta] = array(
        '#attached' => array(
          'library' => array(
            'px_web_graph/px_web_graph_form_actions',
          ),
        ),
        '#theme' => 'px__web__graph',

        //All used as JSON
        '#title' => $item->title,
        '#subtitle' => $item->subtitle,
        '#yAxisName' => $item->yAxisName,
        '#comment' => $item->comment,
        '#displayType' => $item->displayType,
        '#displayMode' => $item->displayMode,
        '#savedResultUrl' => $item->savedResultUrl,
        '#savedResultText' => $item->savedResultText,
        '#displayOptions' => $item->displayOptions,
        '#seriesNames' => $item->seriesNames,
        '#seriesColor' => $item->seriesColor,
        "#id" => $id,
        "#storageName" => $storageName,

        //New
        "#chartDisplayOptions" => '',
      );
    }

    return $elements;
  }


  /**
   * {@inheritdoc}
   */
  public static function defaultSettings() {
    return [
      // Implement default settings.
    ] + parent::defaultSettings();
  }

  /**
   * {@inheritdoc}
   */
  public function settingsForm(array $form, FormStateInterface $form_state) {
    return [
      // Implement settings form.
    ] + parent::settingsForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function settingsSummary() {
    $summary = [];
    // Implement settings summary.

    return $summary;
  }

  /**
   * Generate the output appropriate for one field item.
   *
   * @param \Drupal\Core\Field\FieldItemInterface $item
   *   One field item.
   *
   * @return string
   *   The textual output generated.
   */
  protected function viewValue(FieldItemInterface $item) {
    // The text value has no text format assigned to it, so the user input
    // should equal the output, including newlines.
    return nl2br(Html::escape($item->value));
  }

  private function getDefaultDisplayOptions() {
    return json_decode('{
      "credits": {
        "enabled": false
      },
      "chart": {
        "type": "line",
        "spacing": [50, 30, 50, 30]
      },
      "rangeSelector": {
        "enabled": false
      },
      "exporting": {
        "buttons": {
          "contextButton": {
            "y": -10
          }
        }
      },
      "navigator": {
        "enabled": true
      },
      "title": {
        "text": "",
        "align": "left", 			     
        "y": 0,
        "margin": 20
      },
      "subtitle": {
        "text": "",
        "align": "left",
        "y": 22 
      },
      "legend": {
        "layout": "horizontal",
        "align": "center",
        "verticalAlign": "top",
        "itemStyle": {
          "color": "#000",
          "fontWeight": "normal"
        }
      },
      "xAxis": {
        "title": {
          "enabled": false
        },
        "tickInterval": 31104000000,
        "min": 0,
        "max": 0,
        "type": "datetime",
        "labels": {
          "style": {
            "color": "#000",
            "fontSize": "11px"
          }
        }
      },
      "yAxis": {
        "title": {
          "align": "high",
          "offset": 0,
          "rotation": 0,
          "y": -23,
          "x": -3,
          "text": ""
        },
        "lineColor": "#000",
        "tickColor": "#000",
        "labels": {
          "formatter": "function () { return Highcharts.numberFormat(this.value, 0); }"
        }
      },
      "legend": {
        "enabled": true,
        "layout": "horizontal",
        "backgroundColor": "#FFFFFF",
        "align": "center",
        "verticalAlign": "top",
        "y": -20
      },
      "tooltip": {
        "enabled": true
      },
      "plotOptions": {
        "line": {
          "marker": {
            "enabled": false
          },
          "dataLabels": {
            "enabled": false
          }
        },
        "series": {
          "showInNavigator": true
        }
      }
    }', true);
  }
}
