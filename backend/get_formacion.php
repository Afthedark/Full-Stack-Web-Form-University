<?php
header('Content-Type: application/json');
require_once 'config.php';

$response = array();

try {
    $conn = new mysqli($host, $user, $pass, $db, $port);
    if ($conn->connect_error) {
        throw new Exception('Error de conexión: ' . $conn->connect_error);
    }

    $sql = "SELECT id, nivel_formacion FROM Formacion";
    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        $formaciones = array();
        while ($row = $result->fetch_assoc()) {
            $formaciones[] = $row;
        }
        $response['success'] = true;
        $response['data'] = $formaciones;
    } else {
        $response['success'] = false;
        $response['message'] = 'No se encontraron datos de formación';
    }
    $conn->close();
} catch (Exception $e) {
    $response['success'] = false;
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
