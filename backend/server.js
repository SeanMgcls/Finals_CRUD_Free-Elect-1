const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// CREATE
app.post('/todos', (req, res) => {
    const { title } = req.body;
    db.query('INSERT INTO todos (title) VALUES (?)', [title], (err, result) => {
        if (err) res.status(500).send(err);
        else res.status(201).send({ id: result.insertId, title });
    });
});

// READ
app.get('/todos', (req, res) => {
    db.query('SELECT * FROM todos', (err, results) => {
        if (err) res.status(500).send(err);
        else res.status(200).json(results);
    });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    db.query('UPDATE todos SET title = ? WHERE id = ?', [title, id], (err, result) => {
        if (err) res.status(500).send(err);
        else res.status(200).send({ message: 'Task updated successfully' });
    });
});


// DELETE
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, result) => {
        if (err) res.status(500).send(err);
        else res.status(200).send({ message: 'Deleted successfully' });
    });
});

// Start server
app.listen(process.env.PORT || 3000, () => console.log(`API is now connected on port ${process.env.PORT || 3000}`));