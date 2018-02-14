<?php

namespace Drupal\px_web\Plugin\Field\FieldType;

use Drupal\Component\Utility\Random;
use Drupal\Core\Field\FieldDefinitionInterface;
use Drupal\Core\Field\FieldItemBase;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\Core\TypedData\DataDefinition;

/**
 * Plugin implementation of the 'stored_query_field_type' field type.
 *
 * @FieldType(
 *   id = "stored_query_field_type",
 *   label = @Translation("Stored query field type"),
 *   description = @Translation("This is a store query from px"),
 *   default_widget = "stored_query_widget_type",
 *   default_formatter = "stored_query_formatter_type"
 * )
 */
class StoredQueryFieldType extends FieldItemBase {
  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    
    // Prevent early t() calls by using the TranslatableMarkup.
    $properties['title'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Title'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    $properties['subtitle'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Subtitle'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    $properties['displayType'] = DataDefinition::create('integer')
      ->setLabel(new TranslatableMarkup('displayMode'))
      ->setRequired(TRUE);;
    $properties['displayMode'] = DataDefinition::create('integer')
      ->setLabel(new TranslatableMarkup('displayMode'))
      ->setRequired(TRUE);;
    $properties['savedResultUrl'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Leinkja til PX-fyrispurning'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    $properties['savedResultText'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('PX-úrslit'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    $properties['displayOptions'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Serlig sniðuppsetan'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(FALSE);
    $properties['seriesNames'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('SeriesNames'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    $properties['seriesColor'] = DataDefinition::create('string')
      ->setLabel(new TranslatableMarkup('SeriesColor'))
      ->setSetting('case_sensitive', $field_definition->getSetting('case_sensitive'))
      ->setRequired(TRUE);
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = [
      'columns' => [
        'title' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'subtitle' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'displayType' => [
          'type' => 'int',
          'default' => 0,
        ],
        'displayMode' => [
          'type' => 'int',
          'default' => 0,
        ],
        'savedResultUrl' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'savedResultText' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'displayOptions' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'seriesNames' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
        'seriesColor' => [
          'type' => $field_definition->getSetting('is_ascii') === TRUE ? 'text' : 'text',
          'length' => 65000,
          'binary' => $field_definition->getSetting('case_sensitive'),
        ],
      ],
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $title = $this->get('title')->getValue();
    $subtitle = $this->get('subtitle')->getValue();
    $displayType = $this->get('displayType')->getValue();
    $displayMode = $this->get('displayMode')->getValue();
    $savedResultUrl = $this->get('savedResultUrl')->getValue();
    $savedResultText = $this->get('savedResultText')->getValue();
    $displayOptions = $this->get('displayOptions')->getValue();
    $seriesNames = $this->get('seriesNames')->getValue();
    $seriesColor = $this->get('seriesColor')->getValue();
    
    return empty($title) &&
      empty($subtitle) &&
      empty($displayType) && 
      empty($displayMode) && 
      empty($storedViewFromPx) && 
      empty($savedResultUrl) && 
      empty($savedResultText) && 
      empty($displayOptions) &&
      empty($seriesNames) &&
      empty($seriesColor);
  }

}
