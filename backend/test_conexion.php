<?php
// test_conexion.php
// Este script verifica la conexión a la base de datos usando config.php

require_once 'config.php';

if ($conn && !$conn->connect_error) {
    echo 'Conexión exitosa a la base de datos.';
} else {
    echo 'Error de conexión: ' . $conn->connect_error;
}
?>
