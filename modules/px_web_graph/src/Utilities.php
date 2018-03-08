<?php

namespace Drupal\px_web_graph;
use Drupal\px_web_graph\Px;
use mb_convert_encoding;
use mb_detect_encoding;

class Utilities {
    public function getPxFile(string $address) {
        $pxFileData = "";
        try {
            $pxRequestRaw = file_get_contents($address);
            if ($pxRequestRaw) {
                $encoding = mb_detect_encoding($pxRequestRaw, 'iso-8859-15', true);
                $pxFileData = mb_convert_encoding($pxRequestRaw, 'UTF-8', $encoding);
            }
        }
        catch (Exception $e) {
            echo $e;
        }  

        $px = new Px($pxFileData);
        return $px;
    }
}

?>