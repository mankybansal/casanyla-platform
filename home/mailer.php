<?php
/**
 * Created by PhpStorm.
 * User: mayankbansal
 * Date: 1/16/17
 * Time: 9:21 PM
 */

// the message
$msg = "First line of text\nSecond line of text";

// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg,70);

mail("info@casanyla.com","My subject",$msg);

?>