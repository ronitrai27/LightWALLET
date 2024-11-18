// Required modules
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;
app.use(cookieParser());

// Finnhub and NewsAPI API __________________________
const FINNHUB_API_KEY = "cso30s9r01qkfk5973m0cso30s9r01qkfk5973mg";
const NEWS_API_KEY = "e0048cfda3cd45cebdbbd8078f2cb6e7";
const SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'TSLA'];
// ________________________________________________________

// Enable CORS for all origins
app.use(cors({
  origin: '*', 
  credentials: true 
}));


app.use(cookieParser());


app.use(express.static(__dirname)); 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homePage.html')); 
});


// _______________________________________________________________________________________________________________
// Function to fetch stock price for a symbol__________________________________________________________

// Function to fetch stock data for all symbols
const fetchAllStockData = async () => {
  const stockData = {};
  for (let symbol of SYMBOLS) {
    try {
      const response = await axios.get(
        `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`
      );
      const { c: currentPrice, d: dailyChange, pc: previousClose } = response.data;
      stockData[symbol] = { currentPrice, dailyChange, previousClose };
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      stockData[symbol] = null; 
    }
  }
  return stockData;
};

// API endpoint to get stock data
app.get('/api/stocks', async (req, res) => {
  const stockData = await fetchAllStockData();
  res.json(stockData);
});

// _____________________________________________________________________________________________________________
// FINHUB NEWS API ___________________________________________________________________

const fetchNews = async () => {
  try {
    const response = await axios.get(
      `https://newsapi.org/v2/everything?q=stock&apiKey=${NEWS_API_KEY}`
    );
    const allArticles = response.data.articles;

    const filteredArticles = allArticles.filter(article =>
      /apple|microsoft|tesla/i.test(article.title + article.description)
    );

    return filteredArticles.slice(0, 5);
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};


app.get('/api/news', async (req, res) => {
  const news = await fetchNews();
  res.json(news);
});
// _______________________________________________________________________________________________
// Middleware to check if the user is authenticated (checking cookies)

app.use((req, res, next) => {
  const authToken = req.cookies.auth_token;
  const username = req.cookies.username; 

  if (authToken && username) {
    console.log("Auth Token:", authToken);
    console.log("Username:", username);
    
    next();
  } else {
    console.log("cookies not set")
  }
});

app.post('/logout', (req, res) => {
  // Clear cookies
  res.clearCookie('auth_token', { path: '/', domain: 'localhost' });
  res.clearCookie('username', { path: '/', domain: 'localhost' });

  req.session?.destroy?.();

  res.status(200).send({ message: 'Logged out successfully' });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
