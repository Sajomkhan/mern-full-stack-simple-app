require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

const app = express();
const Todo = require('./models/Todo');

const PORT = process.env.PORT || 3001
const DTABASE = process.env.DTABASE

app.use(cors());
// app.use(express.urlencoded({ extended: true }))
// app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extented: true}));

// connect with DB
const connectDB = async() => {
    try {
        await mongoose.connect(DTABASE)
        console.log("db is connected");
    } catch (error) {
        console.log("db is not connected");
        console.log(error.massage);
        process.exit(1)        
    }
}

app.listen(PORT, ()=>{
    console.log(`server is running at http://localhost:${PORT}`);
    connectDB()
})

app.get('/todos', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
})
app.post('/todo/new', async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
    })
    todo.save();
    res.json(todo);
})

app.delete('/todo/delete/:id', async (req, res) => {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
})

app.get('/todo/complete/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id)

    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
})
