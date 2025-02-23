import express from 'express'; // Importing express
import { readFile } from './helper.js'; // Importing the readFile function from helper.js
import cors from 'cors'; // Importing cors

let data = {};
let current = {};


const app = express(); // Creating an express app
app.set('trust proxy', true)

app.use(cors({
  origin: "*" // Correct the origin value
}));

app.use(express.json()); // Add this line to parse JSON bodies

// Create a route that sends a response when visiting the homepage
app.get('/', async (req, res) => {
  const data = await readFile();
  res.setHeader('Content-Type', 'application/json');
  res.end(data);
});

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

app.post('/update', (req, res) => {
  const request = req.body; // Correctly access the request body
  
 
  console.log(request);
  if (request === undefined) {
    res.status(400).send("Invalid request");
    return;
  }
  data = request;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

// body of req should be a json object with only 1 element, which is the information of current tab returned from data.
app.post('/update_curr', (req, res) => {
  const request = req.body; // Correctly access the request body
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("curr req body: " + request);
  console.log("curr req ip: " + ip);
  if (request === undefined) {
    res.status(400).send("Invalid request");
    return;
  }
  current.ip = request;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

app.get('/current', (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log("curr req ip: " + ip);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(current.ip));
});


// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});