'use strict'
import express from "express";
import fs from "fs/promises";
import bodyParser from "body-parser";
import cors from "cors";
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
// Enable CORS
app.use(cors());


// Endpoint to handle POST requests
app.post('/save', async (req, res) => {
    const POSTdata = req.body;
    
    if (!POSTdata) {
        return res.status(400).json({ message: 'User and score are required' });
    }
    
    try {
        // Read the existing data from highScores.json
        const data = await fs.readFile(path.join(__dirname, 'highScores.json'), 'utf-8');
        let highScores = JSON.parse(data);
        
        // Add the new user and score to the data
        const newEntry = POSTdata;
        highScores.push(newEntry);
        
        // Write the updated data back to highScores.json
        await fs.writeFile(path.join(__dirname, 'highScores.json'), JSON.stringify(highScores, null, 2));
        
        // Respond with success message
        res.json({ message: 'Entry added successfully' });
        
        // Redirect to index.ejs
        res.redirect('/');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
    
});

// Display main page
app.get('/', (req, res) => {
    res.render('index');
});

//Listen to port
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
        console.log("Server listening on Port", PORT);
})