<?php
/**
 * Created by PhpStorm.
 * User: mayankbansal
 * Date: 1/16/17
 * Time: 9:21 PM
 */

if(isset($_GET['to']) && isset($_GET['name']) && isset($_GET['phone']) && isset($_GET['msg'])){


    $to = "info@casanyla.com";
    $subject = "Contact Request";

    $message = "Hello, ".$_GET['name']." has tried to contact you. Phone number: ".$_GET['phone'].". Message: ".$_GET["msg"];

// Always set content-type when sending HTML email
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

// More headers
    $headers .= 'From: <noreply@casanyla.com>' . "\r\n";

    mail($to,$subject,$message,$headers);

    $myfile = fopen("../contacts.txt", "a") or die("Unable to open file!");
    fwrite($myfile, $message);
    fclose($myfile);

    echo json_encode(true);

}else{
    echo json_encode(false);
}


?>