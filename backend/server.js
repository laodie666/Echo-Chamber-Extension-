import express from 'express'; 
import { readFile } from './helper.js'; 
import cors from 'cors'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

let data = {};
let current = new Map();
const GEMINI_API_KEY = 'AIzaSyDfjYxBEGwweSNE5XpQsIOl229kxhe5QCI';

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
app.post('/update_curr/:id', (req, res) => {
  const id = req.params.id;
  console.log("update_curr");
  const request = req.body; // Correctly access the request body
  console.log("curr req body: " + request);
  console.log("curr req id: " + id);
  if (request === undefined) {
    res.status(400).send("Invalid request");
    return;
  }
  current.set(id, request);
  console.log("current updated value at id: " + id);
  console.log(current.get(id));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(request));
});

app.get('/current/:id', (req, res) => {
  const id = req.params.id;
  console.log(current.keys());
  console.log(current.get(id));
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(current.get(id)));

});


// // Gemini integration w/ news search
// const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// // Your predefined list of reliable sources with their leanings
// const NEWS_SOURCES = {
//   "left": ["cnn.com", "theguardian.com", "bbc.com"],
//   "right": ["foxnews.com", "nationalreview.com", "dailywire.com"],
//   "center": ["apnews.com", "reuters.com", "pbs.org"]
// };

// Function to get alternative news articles
// async function getAlternativeNews(articleUrl, targetBias) {
//     const apiKey = 'YOUR_NEWSAPI_KEY'; 
//     const sources = NEWS_SOURCES[targetBias].join(',');
//     const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(articleUrl)}&sources=${sources}&apiKey=${apiKey}`;

//     try {
//         const response = await axios.get(url);
//         const articles = response.data.articles.map(article => ({
//             title: article.title,
//             url: article.url
//         }));
//         return articles;
//     } catch (error) {
//         console.error('Error fetching news articles:', error);
//         return [];
//     }
// }

// API Endpoint ATM never called, also prob not using gemini
// app.get('/search_gemini/:id', async (req, res) => {
//   console.log("searching using gemini");
//     const { url, targetBias } = req.query;
//     console.log("url: " + url + " targetBias: " + targetBias);

//     if (url === undefined|| targetBias === undefined) {
//         return res.status(400).json({ error: "Missing parameters" });
//     }

//     try {
//         const articles = await getAlternativeNews(url, targetBias);
//         res.json({ articles });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to fetch articles" });
//     }
// });

// Set up the server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});