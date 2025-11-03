<?php
// Archivo temporal para probar la consulta de programas
require_once 'config.php';

$lineaId = 1; // Bioética
$formacionId = 1; // Doctorado
$modalidadId = 1; // Presencial

echo "<h2>Test de consulta de programas</h2>";
echo "<p><strong>Buscando programas con:</strong></p>";
echo "<ul>";
echo "<li>Línea de conocimiento: $lineaId (Bioética)</li>";
echo "<li>Formación: $formacionId (Doctorado)</li>";
echo "<li>Modalidad: $modalidadId (Presencial)</li>";
echo "</ul>";

try {
    $sql = "
        SELECT p.id, p.nombre, p.formacion, p.modalidad, p.linea_conocimiento
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

    echo "<h3>Resultados encontrados: " . count($programas) . "</h3>";
    
    if ($programas) {
        echo "<table border='1'>";
        echo "<tr><th>ID</th><th>Nombre</th><th>Formación</th><th>Modalidad</th><th>Línea</th></tr>";
        foreach ($programas as $programa) {
            echo "<tr>";
            echo "<td>" . $programa['id'] . "</td>";
            echo "<td>" . $programa['nombre'] . "</td>";
            echo "<td>" . $programa['formacion'] . "</td>";
            echo "<td>" . $programa['modalidad'] . "</td>";
            echo "<td>" . $programa['linea_conocimiento'] . "</td>";
            echo "</tr>";
        }
        echo "</table>";
    } else {
        echo "<p style='color: red;'>No se encontraron programas.</p>";
    }

    // También probemos ver qué programas hay para cada línea
    echo "<h3>Todos los programas por línea de conocimiento:</h3>";
    $sql2 = "SELECT p.*, l.linea, f.nivel_formacion, m.modalidad 
             FROM programa p 
             LEFT JOIN linea_conocimiento l ON p.linea_conocimiento = l.id
             LEFT JOIN Formacion f ON p.formacion = f.id
             LEFT JOIN modalidad m ON p.modalidad = m.id
             ORDER BY p.linea_conocimiento, p.formacion, p.modalidad";
    
    $stmt2 = $conn->prepare($sql2);
    $stmt2->execute();
    $result2 = $stmt2->get_result();
    $todosLosProgramas = $result2->fetch_all(MYSQLI_ASSOC);
    
    echo "<table border='1' style='font-size: 12px;'>";
    echo "<tr><th>ID</th><th>Programa</th><th>Línea</th><th>Formación</th><th>Modalidad</th></tr>";
    foreach ($todosLosProgramas as $programa) {
        $highlight = ($programa['linea_conocimiento'] == $lineaId && 
                     $programa['formacion'] == $formacionId && 
                     $programa['modalidad'] == $modalidadId) ? "style='background: yellow;'" : "";
        echo "<tr $highlight>";
        echo "<td>" . $programa['id'] . "</td>";
        echo "<td>" . $programa['nombre'] . "</td>";
        echo "<td>" . $programa['linea'] . " (ID: " . $programa['linea_conocimiento'] . ")</td>";
        echo "<td>" . $programa['nivel_formacion'] . " (ID: " . $programa['formacion'] . ")</td>";
        echo "<td>" . $programa['modalidad'] . " (ID: " . $programa['modalidad'] . ")</td>";
        echo "</tr>";
    }
    echo "</table>";

    $stmt->close();
    $stmt2->close();

} catch (Exception $e) {
    echo "<p style='color: red;'>Error: " . $e->getMessage() . "</p>";
}

$conn->close();
?>