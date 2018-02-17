<?php

namespace Drupal\px_web\Plugin\Field\FieldWidget;

use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\WidgetBase;
use Drupal\Core\Form\FormStateInterface;
/**
 * Plugin implementation of the 'stored_query_widget_type' widget.
 *
 * @FieldWidget(
 *   id = "stored_query_widget_type",
 *   label = @Translation("Stored query widget type"),
 *   field_types = {
 *     "stored_query_field_type"
 *   },
 *   multiple_values = TRUE
 * )
 */
class StoredQueryWidgetType extends WidgetBase {

    private $id = 0;
    public static $currentId;

    public static function getNextId() {
        StoredQueryWidgetType::$currentId += 1;
        return StoredQueryWidgetType::$currentId;
    }
  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    // If cardinality is 1, ensure a label is output for the field by wrapping
    // it in a details element.
      if($this->id == 0){
          $this->id  = StoredQueryWidgetType::getNextId();
      }

    $wrapperClass = 'px-web-'.$this->id;
    $element += array(
        '#attributes' => ['class' => [$wrapperClass]],
      '#attached' => [

        'drupalSettings' => [
          'wrapperClass' => $wrapperClass
        ],
        'library' => [
            'px_web/doaction',
            'px_web/px.min',
            'px_web/underscore-min'
        ],
      ],
      // 'settings' => {
      //   'setting1' => 'value1'
      // }
    );

    if ($this->fieldDefinition->getFieldStorageDefinition()->getCardinality() == 1) {
      $element += array(
        '#type' => 'fieldset',
      );
    }

    $element['title'] = [
      '#type' => 'textfield',
      '#title' => 'Yvirskrift',
      '#default_value' => isset($items[$delta]->title) ? $items[$delta]->title : "",
    ];

    $element['subtitle'] = [
      '#type' => 'textfield',
      '#title' => 'Undiryvirskrift',
      '#default_value' => isset($items[$delta]->subtitle) ? $items[$delta]->subtitle : "",
    ];

    $element['yAxisName'] = [
      '#type' => 'textfield',
      '#title' => 'Navn á Y-ása',
      '#default_value' => isset($items[$delta]->yAxisName) ? $items[$delta]->yAxisName : "",
    ];

    $element['comment'] = [
      '#type' => 'textfield',
      '#title' => 'Viðmerking',
      '#default_value' => isset($items[$delta]->comment) ? $items[$delta]->comment : "",
    ];

    $element['displayType'] = [
      '#type' => 'radios',
      '#title' => 'Vel Slag',
      '#options' => array(0 => $this->t('Grafur'), 1 => $this->t('Talva'), 2 => $this->t('Landakort')),
      '#default_value' => isset($items[$delta]->displayType) ? $items[$delta]->displayType : 1,
    ];

    $element['displayMode'] = [
      '#type' => 'radios',
      '#title' => 'Vísing',
      '#options' => array(0 => $this->t('Beinleiðis vísing'), 1 => $this->t('Goym úrslit')),
      '#default_value' => isset($items[$delta]->displayMode) ? $items[$delta]->displayMode : 1,
    ];

    $element['savedResultUrl'] = [
      '#type' => 'textfield',
      '#title' => 'Fyrispurningur úr hagtalsgrunni (PX-fíluslag)',
      '#suffix' => '<div class="load-saved-result-button"></div>',
      '#attributes' => ['class' => ['edit-field-saved-result']],
      '#default_value' => isset($items[$delta]->savedResultUrl) ? $items[$delta]->savedResultUrl : "",
    ];

    $element['savedResultText'] = [
      '#type' => 'textarea',
      '#title' => 'Úrslit',      
      '#attributes' => ['class' => ['edit-field-saved-result-text']],
      '#default_value' => isset($items[$delta]->savedResultText) ? $items[$delta]->savedResultText : "",
    ];

    $element['seriesNames'] = [
      '#type' => 'textfield',
      '#title' => 'Raðnøvn',      
      '#prefix' => '<div><span class="display-options-label"><strong>Uppsetan</strong></span><div class="display-options-wrapper">',
      '#default_value' => isset($items[$delta]->seriesNames) ? $items[$delta]->seriesNames : "",
    ];

    $element['seriesColor'] = [
      '#type' => 'textfield',
      '#title' => 'Raðlitir',      
      '#default_value' => isset($items[$delta]->seriesColor) ? $items[$delta]->seriesColor : "",
    ];

    $element['displayOptions'] = [
      '#type' => 'textarea',
      '#title' => 'Uppsetan',      
      '#prefix' => '<div class="display-options-wrapper">',
      '#suffix' => '<div class="load-display-options-default-button"></div></div></div></div>',
      '#attributes' => ['class' => ['edit-field-display-options']],
      '#default_value' => isset($items[$delta]->displayOptions) ? $items[$delta]->displayOptions : "",
    ];  

    return $element;
    //return ['value' => $element];
  }

  /**
   * {@inheritdoc}
   */
  protected function formMultipleElements(FieldItemListInterface $items, array &$form, FormStateInterface $form_state) {


  //   // We don't want to render empty items on field collection fields
  //   // unless a) the field collection is empty ; b) the form is rebuilding,
  //   // which means that the user clicked on "Add another item"; or
  //   // c) we are creating a new entity.
  //   if ((count($items) > 0) && !$form_state->isRebuilding() && !$items->getEntity()->isNew()) {
  //     $field_name = $this->fieldDefinition->getName();
  //     $cardinality = $this->fieldDefinition->getFieldStorageDefinition()->getCardinality();
  //     $parents = $form['#parents'];
  //     if ($cardinality == FieldStorageDefinitionInterface::CARDINALITY_UNLIMITED) {
  //       $field_state = static::getWidgetState($parents, $field_name, $form_state);
  //       $field_state['items_count']--;
  //       static::setWidgetState($parents, $field_name, $form_state, $field_state);
  //     }
  //   }

  //   // Adjust wrapper identifiers as they are shared between parents and
  //   // children in nested field collections.
  //   $form['#wrapper_id'] = Html::getUniqueID($items->getName());
  //   $elements = parent::formMultipleElements($items, $form, $form_state);
  //   $elements['#prefix'] = '<div id="' . $form['#wrapper_id'] . '">';
  //   $elements['#suffix'] = '</div>';
  //   $elements['add_more']['#ajax']['wrapper'] = $form['#wrapper_id'];
  //   return $elements;
  }

}
