<?php
require_once 'config.php';
header('Content-Type: application/json');

// Consulta para obtener las profesiones desde la tabla linea_conocimiento
$sql = "SELECT id, linea FROM linea_conocimiento";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $profesiones = [];
    while ($row = $result->fetch_assoc()) {
        $profesiones[] = [
            'id' => $row['id'],
            'linea' => $row['linea']
        ];
    }
    echo json_encode(['success' => true, 'data' => $profesiones]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontraron profesiones']);
}

$conn->close();
