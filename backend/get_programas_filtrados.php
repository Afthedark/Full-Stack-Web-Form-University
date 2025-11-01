<?php
// backend/get_programas_filtrados.php

require_once 'config.php';

header('Content-Type: application/json');

try {
    // Verificar si se recibieron los parámetros requeridos
    $lineaId = isset($_GET['linea_id']) ? (int)$_GET['linea_id'] : null;
    $formacionId = isset($_GET['formacion_id']) ? (int)$_GET['formacion_id'] : null;
    $modalidadId = isset($_GET['modalidad_id']) ? (int)$_GET['modalidad_id'] : null;

    // Debug: log de parámetros recibidos
    error_log("=== DEBUG GET_PROGRAMAS_FILTRADOS ===");
    error_log("Parámetros recibidos - lineaId: $lineaId, formacionId: $formacionId, modalidadId: $modalidadId");
    error_log("GET completo: " . print_r($_GET, true));

    if ($lineaId === null || $formacionId === null || $modalidadId === null) {
        error_log("Error: Faltan parámetros requeridos");
        echo json_encode(['success' => false, 'message' => 'Parámetros linea_id, formacion_id y modalidad_id son requeridos.']);
        http_response_code(400);
        exit;
    }

    // Consulta SQL para obtener programas que coincidan con línea, formación Y modalidad
    $sql = "
        SELECT p.id, p.nombre
        FROM programa p
        WHERE p.linea_conocimiento = ?
        AND p.formacion = ?
        AND p.modalidad = ?
        ORDER BY p.nombre ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $lineaId, $formacionId, $modalidadId);
    $stmt->execute();
    $result = $stmt->get_result();
    $programas = $result->fetch_all(MYSQLI_ASSOC);

    // Debug: log de consulta y resultados
    error_log("SQL ejecutado: $sql con parámetros [$lineaId, $formacionId, $modalidadId]");
    error_log("Cantidad de programas encontrados: " . count($programas));
    error_log("Programas encontrados: " . print_r($programas, true));

    if ($programas) {
        echo json_encode(['success' => true, 'data' => $programas]);
    } else {
        // Obtener los nombres textuales para el mensaje personalizado
        $sqlNombres = "
            SELECT l.linea, f.nivel_formacion, m.modalidad
            FROM linea_conocimiento l, Formacion f, modalidad m
            WHERE l.id = ? AND f.id = ? AND m.id = ?
        ";
        
        $stmtNombres = $conn->prepare($sqlNombres);
        $stmtNombres->bind_param('iii', $lineaId, $formacionId, $modalidadId);
        $stmtNombres->execute();
        $resultNombres = $stmtNombres->get_result();
        $nombres = $resultNombres->fetch_assoc();
        
        echo json_encode([
            'success' => true, 
            'data' => [], 
            'message' => 'No se encontraron programas para la combinación seleccionada.',
            'nombres' => $nombres ? $nombres : null
        ]);
        
        $stmtNombres->close();
    }

    $stmt->close();

} catch (Exception $e) {
    error_log("Error en get_programas_filtrados.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor.']);
    http_response_code(500);
}

$conn->close();
?>