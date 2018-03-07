<?php

namespace Drupal\px_web_graph\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

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

    
    $elements = array();

    foreach ($items as $delta => $item) {
        $markup = "";
      $markup .= "<strong>displayMode:</strong> " . $item->displayMode . "<br/>";
      $markup .= "<strong>savedResultUrl:</strong> " . $item->savedResultUrl . "<br/>";
      $markup .= "<strong>savedResultText:</strong> <code>" . $item->savedResultText . "</code><br/>";
      $markup .= "<strong>displayOptions:</strong> " . $item->displayOptions . "<br/>";


      $id = PxWebGraphFormatterType::getNextId();

      $storageName = "pxPlaceholder".$id;
      $elements[$delta] = array(
        //'#theme' => 'test',
        //'#type' => 'markup',
        //'#markup' => $markup,
        '#theme' => 'px__web__graph',
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
        "#storageName" => $storageName
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

}
