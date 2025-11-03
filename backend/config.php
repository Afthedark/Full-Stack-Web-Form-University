<?php
// Configuración de la base de datos
$host = 'localhost';
$db = 'test_posgrados_ubosque';
$user = 'appuser';
$pass = 'apppassword';

$port = 3308;
$conn = new mysqli($host, $user, $pass, $db, $port);
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}
?>