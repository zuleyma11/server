const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./tareas.db', (err) => {
    if (err) {
        console.error('Error al abrir la base de datos:', err.message);
    } else {
        console.log('Conexión exitosa a la base de datos SQLite.');
    }
});

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS tareas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    completada INTEGER DEFAULT 0
)`);



// Agregar Tarea
app.post('/tareas', (req, res) => {
    const { descripcion } = req.body; // Obtiene la descripción de la tarea desde el cuerpo de la solicitud
    const query = `INSERT INTO tareas (descripcion) VALUES (?)`; // Prepara la consulta SQL para insertar una nueva tarea
    db.run(query, [descripcion], function (err) { // Ejecuta la consulta
        if (err) {
            res.status(400).json({ error: err.message }); // Devuelve un error si hay un problema
            return;
        }
        res.json({ id: this.lastID, descripcion, completada: 0 }); // Devuelve la tarea agregada con su ID
    });
});

// Obtener Tareas
app.get('/tareas', (req, res) => {
    const query = `SELECT * FROM tareas`; // Prepara la consulta SQL para obtener todas las tareas
    db.all(query, [], (err, rows) => { // Ejecuta la consulta
        if (err) {
            res.status(400).json({ error: err.message }); // Devuelve un error si hay un problema
            return;
        }
        res.json({ tareas: rows }); // Devuelve todas las tareas en formato JSON
    });
});

// Eliminar Tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params; // Obtiene el ID de la tarea a eliminar desde los parámetros de la solicitud
    const query = `DELETE FROM tareas WHERE id = ?`; // Prepara la consulta SQL para eliminar la tarea
    db.run(query, id, function (err) { // Ejecuta la consulta
        if (err) {
            res.status(400).json({ error: err.message }); // Devuelve un error si hay un problema
            return;
        }
        res.json({ message: 'Tarea eliminada correctamente' }); // Devuelve un mensaje de éxito
    });
});





// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
