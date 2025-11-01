<?php
require_once 'config.php';
header('Content-Type: application/json');

$linea_id = (int)($_GET['linea_id'] ?? 0);

if ($linea_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Línea de conocimiento inválida']);
    exit;
}

$sql = "SELECT id, nombre FROM programa WHERE linea_conocimiento = ? ORDER BY nombre ASC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $linea_id);
$stmt->execute();
$result = $stmt->get_result();

$programas = [];
while ($row = $result->fetch_assoc()) {
    $programas[] = [
        'id' => $row['id'],
        'nombre' => $row['nombre']
    ];
}

if (count($programas) > 0) {
    echo json_encode(['success' => true, 'data' => $programas]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontraron programas para esta línea']);
}

$conn->close();
?>
