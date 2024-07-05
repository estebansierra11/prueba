<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['external'])) {
            fetchExternalAPI();
        } else {
            getTasks($conn);
        }
        break;
    case 'POST':
        addTask($conn);
        break;
    case 'PUT':
        updateTask($conn);
        break;
    case 'DELETE':
        deleteTask($conn);
        break;
    default:
        echo json_encode(['message' => 'Method not supported']);
        break;
}

function fetchExternalAPI() {
    $curl = curl_init();

    curl_setopt_array($curl, array(
        CURLOPT_URL => 'http://consultas.cuc.edu.co/api/v1.0/recursos',
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'GET',
        CURLOPT_HTTPHEADER => array(
            'Authorization: JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjo0LCJ1c2VybmFtZSI6InBydWViYTIwMjJAY3VjLmVkdS5jbyIsImV4cCI6MTY0OTQ1MzA1NCwiY29ycmVvIjoicHJ1ZWJhMjAyMkBjdWMuZWR1LmNvIn0.MAoFJE2SBgHvp9BS9fyBmb2gZzD0BHGPiyKoAo_uYAQ'
        ),
    ));

    $response = curl_exec($curl);

    if ($response === false) {
        echo json_encode(['message' => 'Error en la solicitud a la API externa']);
    } else {
        echo $response;
    }

    curl_close($curl);
}

function getTasks($conn) {
    $sql = "SELECT * FROM tasks order by id asc";
    $result = $conn->query($sql);
    $tasks = [];

    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }

    echo json_encode($tasks);
}

function addTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $task = $data['task'];
    $sql = "INSERT INTO tasks (task) VALUES ('$task')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Task added successfully']);
    } else {
        echo json_encode(['message' => 'Error adding task']);
    }
}

function updateTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $task = $data['task'];
    $isedit = $data['isedit'];
    $unmark = $data['unmark'];

    var_dump ($unmark);
    echo $unmark;
    
    $completed = isset($data['completed']) ? $data['completed'] : 0;
    

    if ($isedit==1) {
        $sql = "UPDATE tasks SET task='$task' WHERE id=$id";
    } else {
        $sql = "UPDATE tasks SET task='$task', completed=$completed WHERE id=$id";
    }

    

  

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Task updated successfully']);
    } else {
        echo json_encode(['message' => 'Error updating task']);
    }
}


function deleteTask($conn) {
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $sql = "DELETE FROM tasks WHERE id=$id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['message' => 'Task deleted successfully']);
    } else {
        echo json_encode(['message' => 'Error deleting task']);
    }
}
?>
