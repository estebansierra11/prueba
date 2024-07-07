
import React from 'react';
import './App.css'; 


import TaskList from './componentes/TaskList'; 

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Lista de Tareas</h1>
            </header>
            <main>
                <TaskList /> {}
            </main>
            <br></br>
            <br></br>
            <br></br>
        </div>
        
    );
}

export default App;
