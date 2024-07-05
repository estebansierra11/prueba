<?php
$host = 'localhost';
$db = 'todolist';
$user = 'root';
$pass = '';

// Crear la conexión
$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);

}
?>
