<?php
require_once 'config.php';
header('Content-Type: application/json');

// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
    exit;
}

// Leer el cuerpo JSON
$input = file_get_contents('php://input');
$data = json_decode($input, true);
if (!$data) {
    http_response_code(400);
    echo json_encode(['error' => 'Datos JSON inválidos']);
    exit;
}

// Extraer datos del objeto formData según el orden de la tabla usuario
$nombre = $data['contact']['nombre'] ?? '';
$email = $data['contact']['email'] ?? '';
$celular = $data['contact']['celular'] ?? '';
$edad = $data['age'] ?? '';
$genero = $data['gender'] ?? '';
$profesion = $data['profession'] ?? '';
$posgrado = $data['postgraduate'] ?? '';
$razones = isset($data['reasons']) ? json_encode($data['reasons']) : '';
$seguridad = $data['seguridad'] ?? '';
$estres = $data['stress'] ?? '';
$comodidad_estudio = $data['study_comfort'] ?? '';
$metodos_aprendizaje = isset($data['learning_methods']) ? json_encode($data['learning_methods']) : '';
$modalidades = $data['modalities'] ?? ''; // Solo un ID, no necesita json_encode
$desafios = isset($data['challenges']) ? json_encode($data['challenges']) : '';
$vision_futuro = isset($data['future_vision']) ? json_encode($data['future_vision']) : '';
$respuesta_dificultad = isset($data['difficulty_response']) ? json_encode($data['difficulty_response']) : '';
$fecha_inicio = $data['start_date'] ?? '';
$financiamiento = isset($data['financing']) ? json_encode($data['financing']) : '';
$programa = $data['programa'] ?? ''; // Campo programa para uso futuro

// Insertar en el orden exacto de las columnas de la tabla usuario
$sql = "INSERT INTO usuario (nombre, email, celular, edad, genero, profesion, posgrado, razones, seguridad, estres, comodidad_estudio, metodos_aprendizaje, modalidades, desafios, vision_futuro, respuesta_dificultad, fecha_inicio, financiamiento, programa) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('sssssssssssssssssss', $nombre, $email, $celular, $edad, $genero, $profesion, $posgrado, $razones, $seguridad, $estres, $comodidad_estudio, $metodos_aprendizaje, $modalidades, $desafios, $vision_futuro, $respuesta_dificultad, $fecha_inicio, $financiamiento, $programa);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Formulario guardado exitosamente']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error al guardar: ' . $stmt->error]);
}
$stmt->close();
$conn->close();
?>