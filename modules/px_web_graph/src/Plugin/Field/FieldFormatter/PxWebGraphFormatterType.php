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

  private function log($o) {
    var_dump($o);
    echo "<br/>";
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
      //   $variables = $pxFile->variables();

      //   //Find time value
      //   $timeValueType = $timeValues->subKeys[0];
      //   if(is_array($headings->values)) {
      //     if($headings->values[0] != $timeValueType)
      //       $timeValueType = $headings->values[0];
      //   }

      //   $timeValuesElements = $timeValues->values;        

      //   // $this->log("-- headings");
      //   // $this->log($headings->values);

      //   // $this->log("-- values");
      //   // $this->log($pxFile->values("kyn"));
      //   // $this->log($pxFile->values("mát"));
      //   // $this->log($pxFile->values("mánaður"));

      //   // $this->log("-- timeVal");
      //   // $this->log($timeValuesElements);

      //   // $this->log("-- timeValueTypes");
      //   // $this->log($timeValueType);

      //   // $this->log("-- timeValues");
      //   // $this->log($pxFile->values($timeValueType));


      //   //Try and join all stubs to individual series
      //   $series = [];
      //   foreach($stubs->values as $stub) {
      //     $partialSeries = $pxFile->values($stub);
      //     $semiSeries = $series;
      //     $series = [];

      //     if(count($semiSeries) > 0) {
      //       foreach($semiSeries as $semiSerie) {
      //         foreach($partialSeries as $partialSerie) {
      //           $serie = $semiSerie . " - " . $partialSerie;
      //           array_push($series, $serie);
      //         }    
      //       }
      //     } else {
      //       foreach($partialSeries as $partialSerie) {
      //         $serie = $partialSerie;
      //         array_push($series, $serie);
      //       }    
      //     }
      //   }
      //   $this->log($series);

        

      //   //Find Colors
      //   $colors = ["#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169', "#7fb800", "#00a6ed", "#f7b538", "#fb6107", '#9b1212', '#306b34', '#012169'];
        
      //   if($item->seriesColor) {
      //     $arrayOfColors = split(",", $item->seriesColor);
      //     for($i =0; $i < count($arrayOfColors); $i++) {
      //       if (count($colors) <= $i) {
      //         array_push($arrayOfColors[$i]);
      //       } else {
      //         $colors[$i] = $arrayOfColors[$i];
      //       }
      //     }
      //   }


      //   //Find Series Names
      //   $seriesNames = [];
      //   if ($item->seriesNames) {
      //     $seriesNames = split(",", $item->seriesNames);
      //   }

      //   //Process Data
      //   $timeValues = $pxFile->values($timeValueType);

      //   $min = 999999999999999;
      //   $max = 0;
      //   $processedData = [];
      //   $tickIntervalToUse = 24 * 3600 * 1000 * 25; //TODO: defaultDisplayOptions.xAxis.tickInterval
      //   $isCategory = false;

      //   //data
      //   $data = $pxFile->data();

      //   for($i = 0; $i < count($series); $i++) {
      //     $currentSeries = $series[$i];

      //     $serie = new stdClass();
      //     $serie->data = [];
      //     $serie->color = $colors[$i];
      //     $serie->borderWidth = 0;
      //     $serie->data = [];
      //     $serie->tooltip = new stdClass();
      //     $serie->tooltip->valueDecimals = 0;

      //     //Set series name
      //     if (count($seriesNames) > $i && count($seriesNames[$i]) > 0)
      //       $serie->name = $seriesNames[$i];
      //     else
      //       $serie->name = $currentSeries;

      //     //Set Series Color
      //     if (count($colors) > $i && count($colors[$i]) > 0)
      //         $serie->color = $colors[$i];
      //     else
      //         $serie->color = "#002d62";


      //     for ($j = 0; $j < count($timeValues); $j++) {
      //       $timeValue = $timeValues[$j];

      //        $time = $timeValue;
      //       if(strpos($time, 'M') > 0) {
      //          $time = str_replace("M", "-", $time);
      //          $tickIntervalToUse = 24 * 3600 * 1000 * 25;
      //       } 

      //       $date = date_parse($time);
      //       //TODO NEED TO CONVERT TO JS TICKS
            
      //       $calculatedIndex = $j + (count($timeValues) * $i);
      //       $value = $data[$calculatedIndex];
            

      //       if(count($date->errors) == 0) {
      //         array_push($serie->data, [ 0, $value ]);
      //       } else {
      //         $isCategory = true;
      //         array_push($serie->data, [ $timeValue, $value ]);
      //       }

      //       // let date = Date.parse(time);

      //       // if (!isNaN(date)) {
      //       //     if (min > date)
      //       //         min = date;
      //       //     if (date > max)
      //       //         max = date;

      //       //     serie.data.push([date, parseFloat(data[i + (timeValues.length * j)])]);
      //       // } else {
      //       //     isCategory = true;
      //       //     serie.data.push([timeValue, parseFloat(data[i + (timeValues.length * j)])]);
      //       // }
      //     }

      //     array_push($processedData, $serie);
      //   }
      //   //$this->log($processedData);
        

        

      //   //Find time values (X-Axis)
      //   // echo "timeValues<br/>";
      //   // var_dump($timeValues);
      //   // echo "<br/><br/>";

      //   // echo "headings<br/>";
      //   // var_dump($headings);
      //   // echo "<br/><br/>";

      //   // echo "values<br/>";
      //   // var_dump($values);
      //   // echo "<br/><br/>";

      //   // echo "stubs<br/>";
      //   // var_dump($stubs);
      //   // echo "<br/><br/>";

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
