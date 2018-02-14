<?php

namespace Drupal\px_web\Plugin\Field\FieldFormatter;

use Drupal\Component\Utility\Html;
use Drupal\Core\Field\FieldItemInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\FormatterBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Plugin implementation of the 'stored_query_formatter_type' formatter.
 *
 * @FieldFormatter(
 *   id = "stored_query_formatter_type",
 *   label = @Translation("Stored query formatter type"),
 *   field_types = {
 *     "stored_query_field_type"
 *   }
 * )
 */
class StoredQueryFormatterType extends FormatterBase {

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

      $elements[$delta] = array(
        '#type' => 'markup',
        '#markup' => $markup,
        '#title' => $item->title,
        '#subtitle' => $item->subtitle,
        '#displayType' => $item->displayType,
        '#displayMode' => $item->displayMode,
        '#savedResultUrl' => $item->savedResultUrl,
        '#savedResultText' => $item->savedResultText,
        '#displayOptions' => $item->displayOptions,
        '#seriesNames' => $item->seriesNames,
        '#seriesColor' => $item->seriesColor,
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
