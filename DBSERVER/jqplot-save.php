<?php
    # Stolen from http://greenethumb.com/article/1429/user-friendly-image-saving-from-the-canvas/
    # we are a PNG image
    header('Content-type: image/png');
     
    # we are an attachment (eg download), and we have a name
    header('Content-Disposition: attachment; filename="' . $_POST['name'] .'"');
     
    #capture, replace any spaces w/ plusses, and decode
    $encoded = $_POST['imgdata'];
    $encoded = str_replace(' ', '+', $encoded);
    $decoded = base64_decode($encoded);
     
    #write decoded data
    ob_clean();
    echo $decoded;
?>