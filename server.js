import express from 'express'; // Importing express
import { promises as fs } from 'node:fs'; // Importing the file system module
import { readFile } from './helper.js'; // Importing the readFile function from helper.js

const app = express(); // Creating an express app

// Create a route that sends a response when visiting the homepage
app.get('/', async (req, res) => {
  const data = await readFile();
  res.setHeader('Content-Type', 'application/json');
  res.end(data);
});

// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});