<?php

opcache_reset();


function generateRandomString($length = 8)
{
    $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

if (isset($_POST['folder'])) {
    $folder = $_POST['folder'] . "/";

    if (!file_exists('../platform-assets/styles/'.$_POST['folder'])) {
        mkdir('../platform-assets/styles/'.$_POST['folder'], 0777, true);
    }
} else {
    $folder = "";
}

if (isset($_POST['extra'])) {
    $extra = $_POST['extra'] . "/";
} else {
    $extra = "";
}

if (0 < $_FILES['file']['error']) {
    echo 'Error: ' . $_FILES['file']['error'];

    $response = Array(
        "fileName" => null,
        "message" => "Error: " . $_FILES['file']['error']
    );

    echo json_encode($response);
} else {
    $temp = explode(".", $_FILES["file"]["name"]);
    $newFile = generateRandomString() . '.' . end($temp);
    move_uploaded_file($_FILES["file"]["tmp_name"], '../platform-assets/styles/' . $folder . $extra . $newFile);

    $response = Array(
        "fileName" => $newFile,
        "message" => $newFile . " has been uploaded to: " . '../platform-assets/styles/' . $folder . $extra
    );

    echo json_encode($response);
}

?>
