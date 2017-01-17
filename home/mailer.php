<?php
/**
 * Created by PhpStorm.
 * User: mayankbansal
 * Date: 1/16/17
 * Time: 9:21 PM
 */

$to = "info@casanyla.com";
$subject = "HTML email";

$message = "Test";

// Always set content-type when sending HTML email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
$headers .= 'From: noreply@casanyla.com>' . "\r\n";

mail($to,$subject,$message,$headers);
?>

?>