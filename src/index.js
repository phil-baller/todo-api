const express = require('express');
const fs = require('fs')
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 5001
const task = express();
task.use(cors());
task.use(bodyParser.json());

task.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})
let data = fs.readFileSync('./src/tasks.json');

const allTasks = JSON.parse(data);

//Get Tasks
task.get('/', (req, res) => {
    res.json(allTasks)
})

//Create Task
task.post('/', (req, res) => {
    const newTask = {
        id: allTasks.length + 1,
        name: req.body.name,
        description: req.body.description
    }
    console.log(newTask)
    allTasks.push(newTask)
    fs.writeFile('./src/tasks.json', JSON.stringify(allTasks), (err) => {
        if (err) console.log(`Error writing to file, ${err}`);
        console.log('The file has been saved!');
    });
    res.json(allTasks)
})

//Delete Task
task.delete('/:id', (req, res) => {
    const id = Number(req.params.id)
    const index = allTasks.findIndex(task => task.id === id);
    if (index !== -1)
        allTasks.splice(index, 1)
    fs.writeFile('./src/tasks.json', JSON.stringify(allTasks), (err) => {
        if (err) throw err;
    });
    res.json(allTasks)
})


//Update Task
task.put('/:id', (req, res) => {
    const id = req.params.id
    const taskIndex = allTasks.findIndex(task => task.id === id)
    allTasks[taskIndex].name = req.body.name
    allTasks[taskIndex].description = req.body.description
    res.json(allTasks)
})

module.exports = task;