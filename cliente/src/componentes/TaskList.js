import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [tasks, setTasks] = useState([]);
    const [task, setTask] = useState('');
    const [editTask, setEditTask] = useState({ id: null, task: '' });
    const [nombres, setNombres] = useState([]);
    const [selectedNombre] = useState('');

    useEffect(() => {
        fetchTasks();
        fetchNombres();
    }, []);

    const fetchTasks = async () => {
        const response = await fetch('http://localhost/prueba/servidor/api.php');
        const data = await response.json();
        setTasks(data);
    };

    const fetchNombres = async () => {
        try {
            const response = await fetch("http://localhost/prueba/servidor/api.php?external=true");
            const result = await response.json();
            setNombres(result); 
        } catch (error) {
            console.error("Error fetching nombres:", error);
        }
    };

    const addTask = async () => {
        await fetch('http://localhost/prueba/servidor/api.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task }),
        });
        setTask('');
        fetchTasks();
    };

    const updateTask = async (id, newTask, isedit) => {
        await fetch('http://localhost/prueba/servidor/api.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, task: newTask, isedit }),
        });
        fetchTasks();
        setEditTask({ id: null, task: '' });
    };

    const updateTaskCompletion = async (id, completed) => {
        const task = tasks.find(t => t.id === id);
        await fetch('http://localhost/prueba/servidor/api.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, task: task.task, completed: completed ? 1 : 0 }),
        });
        fetchTasks();
    };

    const deleteTask = async (id) => {
        await fetch('http://localhost/prueba/servidor/api.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        fetchTasks();
    };

    const markTask = async (id) => {
        const task = tasks.find(t => t.id === id);
        await updateTaskCompletion(id, !task.completed);
    };

    const startEditTask = (task) => {
        setEditTask({ id: task.id, task: task.task });
    };

    const handleEditTaskChange = (e) => {
        setEditTask({ ...editTask, task: e.target.value });
    };

    const saveTask = async () => {
        if (editTask.id !== null) {
            await updateTask(editTask.id, editTask.task, 1);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Lista de Tareas</h1>
            <div className="input-group mb-3">
            <select
                    className="form-select"
                    id="selectNombre"
                    value={selectedNombre}
                    onChange={(e) =>  setTask(e.target.value)}
                >
                    <option value="">Seleccione un nombre</option>
                    {nombres.map((nombre, index) => (
                        <option key={index} value={nombre.nombre}>
                            {nombre.nombre}
                        </option>
                    ))}
                </select>
                <button className="btn btn-primary" onClick={addTask}>
                    Añadir
                </button>
            </div>

            

            <ul className="list-group">
                {tasks.map((taskItem) => (
                    <li key={taskItem.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="w-75">
                            <input
                                type="text"
                                className="form-control"
                                value={editTask.id === taskItem.id ? editTask.task : taskItem.task}
                                onChange={editTask.id === taskItem.id ? handleEditTaskChange : null}
                                style={{ backgroundColor: taskItem.completed ? 'green' : 'white' }}
                                disabled={editTask.id !== taskItem.id}
                            />
                        </div>
                        <div className="btn-group" role="group" aria-label="Acciones">
                            {editTask.id === taskItem.id ? (
                                <button className="btn btn-success mr-1" onClick={saveTask}>
                                    Guardar
                                </button>
                            ) : (
                                <>
                                    {taskItem.completed ? (
                                        <button className="btn btn-danger mr-2" onClick={() => deleteTask(taskItem.id)}>
                                            Eliminar
                                        </button>
                                    ) : (
                                        <>
                                            <button className="btn btn-warning mr-2" onClick={() => startEditTask(taskItem)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-success mr-2" onClick={() => markTask(taskItem.id)}>
                                                Marcar
                                            </button>
                                            <button className="btn btn-danger mr-2" onClick={() => deleteTask(taskItem.id)}>
                                                Eliminar
                                            </button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
