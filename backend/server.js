import express from 'express'; // Importing express
import { readFile } from './helper.js'; // Importing the readFile function from helper.js
import cors from 'cors'; // Importing cors

let bias_average = 0;
let bias_variance = 0;
let sites_visited = 0;
let news_sites_visited = 0;


const app = express(); // Creating an express app

app.use(cors({
  origin: "*"
}));

// Create a route that sends a response when visiting the homepage
app.get('/', async (req, res) => {
  const data = await readFile();
  res.setHeader('Content-Type', 'application/json');
  res.end(data);
});

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({"bias_average": bias_average, "bias_variance": bias_variance, "sites_visited": sites_visited, "news_sites_visited": news_sites_visited}));
});

// req should be a json object matching the 4 constants above
app.post('/update', (req, res) => {
  const {request} = req;
  if (request === undefined || request.bias_average === undefined || request.bias_variance === undefined || request.sites_visited === undefined || request.news_sites_visited === undefined) {
    res.status(400).send("Invalid request");
    return;
  }
  bias_average = request.bias_average;
  bias_variance = request.bias_variance;
  sites_visited = request.sites_visited;
  news_sites_visited = request.news_sites_visited;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({"bias_average": bias_average, "bias_variance": bias_variance, "sites_visited": sites_visited, "news_sites_visited": news_sites_visited}));
});


// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
