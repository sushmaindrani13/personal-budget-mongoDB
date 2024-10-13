// Budget API

const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 
const port = 3000;
const budgetSchema =  require('./database_schema');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
var budget = {};

app.use(cors());

app.get('/', express.static('public'));

app.use(express.static('public'));

const mongoURI = 'mongodb://localhost:27017/personalBudget';


app.get('/hello', (req, res) => {
    res.send('Hello world');
});


fs.readFile('data.json', 'utf8', (err, data) => {
    if (err) {
        console.error("Error reading the JSON file:", err);
        return;
    }

     budget = JSON.parse(data);

});

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.get('/budget', (req, res) => {
    budgetSchema.find({})
        .then((budgets) => {
            res.json(budgets); // Send the retrieved data as a JSON response
        })
        .catch((error) => {
            console.error('Error fetching budgets:', error);
            res.status(500).json({ error: 'Error fetching budgets from database' });
        });
    
});


app.post('/budget', (req, res) => {
    // Extract the data from the request body
    const { title, value, color } = req.body;

    // Validate that the required fields are present
    if (!title || !value || !color) {
        return res.status(400).json({ error: 'Title, value, and color are required' });
    }
        budgetSchema.findOneAndUpdate(
            { title: title },  // Find budget by title
            { value: value, color: color },  // Update value and color fields
            { new: true, upsert: true }  // Return the updated document or create it if it doesn't exist
        )
        .then(updatedBudget => {
            // res.json(budget);
            res.json(updatedBudget);  // Send the updated budget object as a response
        })
        .catch(error => {
            res.status(500).json({ error: 'Error updating the budget' });
        });
    });


app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});