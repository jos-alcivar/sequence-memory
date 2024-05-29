'use strict'
import express from "express";
import fs from "fs";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//Defining variables
const app = express();
const PORT = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));

//Set static directories
app.use(express.static('public'));
app.use('/assets', express.static('assets'));
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Display main page
app.get('/', (req, res) => {
    res.render('index');
});

// Endpoint to handle POST requests
app.post('/save', (req, res) => {
    const { user, score } = req.body;

    if (!user || !score) {
        return res.status(400).json({ message: 'User and score are required' });
    }

    // Read the existing data from highScores.json
    fs.readFile(path.join(__dirname, 'highScores.json'), 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Parse the existing data
        let scoresData = [];
        try {
            scoresData = JSON.parse(data);
        } catch (parseErr) {
            console.error('Error parsing JSON:', parseErr);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Add the new user and score to the data
        const newEntry = { user, score };
        scoresData.push(newEntry);

        // Write the updated data back to highScores.json
        fs.writeFile(path.join(__dirname, 'highScores.json'), JSON.stringify(scoresData, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            // Render the index.ejs with the updated data
            res.render('index', { scores: scoresData });
        });
    });
});

//Listen to port
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})