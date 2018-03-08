<?php

namespace Drupal\px_web_graph;

use RuntimeException;
use stdClass;

/**
 * PC-Axis (PX) file reader
 */
class Px
{
    const DEFAULT_CHARSET = '437';

    /**
     * @var string
     */
    private $content;

    /**
     * @var array
     */
    private $keywords;

    /**
     * @var array
     */
    private $data;

    /**
     * @var string
     */
    private $charset;

    /**
     * @var string
     */
    private $codepage;

    /**
     * @var array
     */
    private $indexMultipliers;

    /**
     * Constructor
     *
     * @param string $path path to your PX file
     */
    public function __construct($content)
    {
        $this->content = $content;
        $this->charset = self::DEFAULT_CHARSET;
    }

    /**
     * Returns a list of all variables.
     *
     * @return array
     */
    public function variables()
    {
        if (!$this->hasKeyword('STUB')) {
            return $this->keyword('HEADING')->values;
        } elseif (!$this->hasKeyword('HEADING')) {
            return $this->keyword('STUB')->values;
        } else {
            return array_merge($this->keyword('STUB')->values, $this->keyword('HEADING')->values);
        }
    }

    /**
     * Returns a list of all possible values of a variable.
     *
     * @param string $variable
     *
     * @return array
     */
    public function values($variable)
    {
        foreach ($this->keywordList('VALUES') as $keyword) {
            if ($keyword->subKeys[0] == $variable) {
                return $keyword->values;
            }
        }
        throw new RuntimeException(sprintf('Could not determine values of "%s".', $variable));
    }

    /**
     * Returns a list of all possible codes of a variable.
     *
     * @param string $variable
     *
     * @return array|null
     */
    public function codes($variable)
    {
        foreach ($this->keywordList('CODES') as $keyword) {
            if ($keyword->subKeys[0] == $variable) {
                return $keyword->values;
            }
        }

        return null;
    }

    /**
     * Computes the index within the data matrix.
     *
     * @param array $indices An array of all value indices
     *
     * @return int
     */
    public function index($indices)
    {
        $this->assertIndexMultipliers();

        $index = 0;
        for ($i = 0, $length = count($this->indexMultipliers); $i < $length; ++$i) {
            $index += $indices[$i] * $this->indexMultipliers[$i];
        }

        return $index;
    }

    /**
     * Gets a single data point.
     *
     * @param array $indices An array of all value indices
     *
     * @return string
     */
    public function datum($indices)
    {
        $this->assertData();

        $index = $this->index($indices);
        if (isset($this->data[$index])) {
            return $this->data[$index];
        } else {
            return null;
        }
    }

    /**
     * Returns a list of all keywords.
     *
     * @return array
     */
    public function keywords()
    {
        $this->assertKeywords();

        return $this->keywords;
    }

    /**
     * Returns all keywords with a given name.
     *
     * @param string $keyword
     *
     * @return array
     */
    public function keywordList($keyword)
    {
        $this->assertKeywords();

        if (isset($this->keywords[$keyword])) {
            return $this->keywords[$keyword];
        } else {
            return [];
        }
    }

    /**
     * Checks whether a keyword exists.
     *
     * @param string $keyword
     *
     * @return bool
     */
    public function hasKeyword($keyword)
    {
        $this->assertKeywords();

        return isset($this->keywords[$keyword]);
    }

    /**
     * Returns the first keyword with a given name.
     *
     * @param string $keyword
     *
     * @return object
     */
    public function keyword($keyword)
    {
        $list = $this->keywordList($keyword);
        if (empty($list)) {
            throw new RuntimeException(sprintf('Keyword "%s" does not exist.', $keyword));
        }

        return $this->extractLanguageSpecificData($list);
    }

    /**
     * Gets all data cells.
     *
     * @param array
     */
    public function data()
    {
        $this->assertData();

        return $this->data;
    }

    private function extractLanguageSpecificData($datas) {
        $found = null;
        if(!$datas)
            return $found;
        
        foreach ($datas as $data) {
            if($found == null && $data->lang == null)
            $found = $data;

            if($data->lang == $this->getPreferredLang())
            $found = $data;
        }
        return $found;
    }

    private function getPreferredLang() {
        return "fo";
    }
    

    private function parseKeywordLine($line)
    {
        

        $data = new stdClass();

        $line = trim(str_replace('""', ' ', $line));
        $data->raw = $line;

        $equalPos = self::findQuoted($line, '=');
        if ($equalPos <= 0) {
            return;
        }

        $key = substr($line, 0, $equalPos);
        $data->subKeys = [];
        if (substr($key, -1) === ')' && ($start = self::findQuotedReverse($key, '(')) !== false) {
            $data->subKeys = self::split(substr($key, $start + 1, -1));
            $key = substr($key, 0, $start);
        }
        $data->lang = null;
        if (substr($key, -1) === ']' && ($start = self::findQuotedReverse($key, '[')) !== false) {
            $data->lang = trim(substr($key, $start + 1, -1), '"');
            $key = substr($key, 0, $start);
        }

        $data->values = self::split(substr($line, $equalPos + 1));

        if (!isset($this->keywords[$key])) {
            $this->keywords[$key] = [];
        }
        $this->keywords[$key][] = $data;

        if ($key === 'CHARSET') {
            $this->charset = $data->values[0];
            if ($this->charset === 'ANSI' && $this->codepage === null) {
                $this->codepage = 'ISO-8859-1';
            }
        } elseif ($key === 'CODEPAGE') {
            $this->codepage = $data->values[0];
        }
    }

    private function assertKeywords()
    {
        $separator = ";";
        $line = strtok($this->content, $separator);
        
        $this->keywords = [];
        while ($line !== false) {
            $line = trim($this->decodeLine($line));
            if (substr($line,0, 5) == 'DATA=') {
                break;
            }
            $this->parseKeywordLine($line);
            $line = strtok( $separator );
        }
    }

    private function assertData()
    {
        if ($this->data !== null) {
            return;
        }

        $this->assertKeywords();

        $separator = ";";
        $line = strtok($this->content, $separator);
        
        $raw = "";
        while ($line !== false) {
            $line = trim($this->decodeLine($line));            
            if (substr($line,0, 5) == 'DATA=') {
                $raw = substr($line,7);    
                break;
            }
            $line = strtok( $separator );
        }

        $cells = [];
        $len = strlen($raw);
        $value = '';
        for ($i = 0; $i < $len; $i++) {
            if ($value === '' && $raw[$i] === '"' && ($end = strpos($raw, '"', $i + 1)) !== false) {
                $cells[] = substr($raw, $i + 1, $end - $i - 1);
                $i = $end;
                $value = '';
            } elseif (in_array($raw[$i], [' ', ',', ';', "\t"])) {
                if ($value !== '') {
                    $cells[] = $value;
                    $value = '';
                }
            } else {
                $value .= $raw[$i];
            }
        }
        if ($value !== '') {
            $cells[] = $value;
        }

        $this->data = $cells;
    }

    private function assertIndexMultipliers()
    {
        if ($this->indexMultipliers !== null) {
            return;
        }

        $variables = $this->variables();
        $count = count($variables);

        $this->indexMultipliers = [];
        $this->indexMultipliers[$count - 1] = 1;
        for ($i = $count - 2; $i >= 0; --$i) {
            $this->indexMultipliers[$i] = count($this->values($variables[$i + 1])) * $this->indexMultipliers[$i + 1];
        }
    }

    private function decodeLine($line)
    {
        return $line;
    }

    private static function split($string)
    {
        $values = [];
        while (($pos = self::findQuoted($string, ',')) !== false) {
            $values[] = trim(trim(substr($string, 0, $pos)), '"');
            $string = substr($string, $pos + 1);
        }
        $values[] = trim(trim($string), '"');

        return $values;
    }

    private static function findQuoted($haystack, $needle)
    {
        $pos = 0;
        while (($pos = strpos($haystack, $needle, $pos)) !== false) {
            if (substr_count($haystack, '"', 0, $pos) % 2 == 0) {
                return $pos;
            }
            $pos++;
        }

        return $pos;
    }

    private static function findQuotedReverse($haystack, $needle)
    {
        $len = strlen($haystack);
        $pos = strlen($haystack);
        while (($pos = strrpos($haystack, $needle, $pos - $len)) !== false) {
            if (substr_count($haystack, '"', $pos) % 2 == 0) {
                return $pos;
            }
            $pos--;
        }

        return $pos;
    }
}
