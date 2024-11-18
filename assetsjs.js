const API_BASE_URL = 'https://api.coingecko.com/api/v3';

async function fetchTopGainersAndLosers() {
    try {
        const response = await fetch(`${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

       
        const sortedData = [...data].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
        const topGainers = sortedData.slice(0, 5); 
        const topLosers = sortedData.slice(-5).reverse(); 

        // Display top gainers
        topGainers.forEach(coin => {
            document.getElementById('top-gainers').innerHTML += `
                <div class="p-4 border rounded-2xl bg-color-primary-light text-color-white shadow-sm">
                    <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong></p>
                    <p class="text-green-400 text-lg">Price: $${coin.current_price.toLocaleString()}</p>
                    <p class="text-green-400 text-lg">24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                </div>`;
        });
        // Display top losers
        topLosers.forEach(coin => {
            document.getElementById('top-losers').innerHTML += `
                <div class="p-4 border rounded-2xl bg-color-primary-light shadow-sm text-color-white">
                    <p><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong></p>
                    <p class="text-red-400 text-lg">Price: $${coin.current_price.toLocaleString()}</p>
                    <p class="text-red-400 text-lg">24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%</p>
                </div>`;
        });
    } catch (error) {
        console.error('Error fetching gainers and losers:', error);
    }
}

// Function to fetch trending coins
async function fetchTrendingCoins() {
    try {
        const response = await fetch(`${API_BASE_URL}/search/trending`);
        if (!response.ok) throw new Error('Failed to fetch trending coins');
        const data = await response.json();

        // Display only the top 5 trending coins
        data.coins.slice(0, 5).forEach(item => {
            const coin = item.item;
            document.getElementById('trending-coins').innerHTML += `
                <div class="p-4 border rounded-2xl bg-color-primary-light shadow-md">
                    <p class="text-color-white text-lg"><strong>${coin.name} (${coin.symbol.toUpperCase()})</strong></p>
                    <p class="text-green-400 text-lg">Market Cap Rank: ${coin.market_cap_rank}</p>
                </div>`;
        });
    } catch (error) {
        console.error('Error fetching trending coins:', error);
    }
}


fetchTopGainersAndLosers();
fetchTrendingCoins();

// _____________________________________________________________________________________
// CRYTPO - PRICING _____________________________________________________________________
const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,binancecoin,tether';

async function fetchCryptoData() {
try {
const response = await fetch(API_URL);
if (!response.ok) {
throw new Error('Failed to fetch data');
}
const data = await response.json();

data.forEach(crypto => {
const symbol = crypto.id;
document.getElementById(`${symbol}-price`).textContent = `$${crypto.current_price.toLocaleString()}`;
//   document.getElementById(`${symbol}-market-cap`).textContent = `$${crypto.market_cap.toLocaleString()}`;
document.getElementById(`${symbol}-volume`).textContent = `$${crypto.total_volume.toLocaleString()}`;
});

} catch (error) {
console.error('Error fetching crypto data:', error);
document.querySelectorAll('.crypto-item').forEach(el => el.textContent = 'Error fetching data');
}
}

fetchCryptoData();
// __________________________________________________________________________________________________
// FINHUB STOCKS _____________________________________________________________________________________
const API_KEY = "cso30s9r01qkfk5973m0cso30s9r01qkfk5973mg";

const stockSymbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "NFLX"];

// Function to fetch stock data
async function fetchStockData(symbol) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Error fetching data for ${symbol}`);
        return null;
    }
    return response.json();
}

// Function to update HTML with stock data
async function updateStockData() {
    for (let symbol of stockSymbols) {
        const stockData = await fetchStockData(symbol);
        if (stockData) {
            // Update stock details by ID
            document.getElementById(`${symbol}-price`).textContent = `$${stockData.c.toFixed(2)}`; 

            const dailyChange = stockData.d.toFixed(2); 
            const dailyChangeElement = document.getElementById(`${symbol}-dailychange`);
            dailyChangeElement.textContent = `${dailyChange > 0 ? "+" : ""}${dailyChange}`;
            dailyChangeElement.className = dailyChange > 0 ? "text-green-400 text-xl" : "text-red-400 text-xl"; 

            // Add trend arrow icon
            const trendIcon = document.createElement("i");
            trendIcon.className = dailyChange > 0 
                ? "fa-solid fa-arrow-trend-up text-green-400 ml-2" 
                : "fa-solid fa-arrow-trend-down text-red-400 ml-2";

        
            if (dailyChangeElement.querySelector("i")) {
                dailyChangeElement.querySelector("i").remove();
            }
            
          
            dailyChangeElement.appendChild(trendIcon);

            document.getElementById(`${symbol}-openingprice`).textContent = `$${stockData.o.toFixed(2)}`; // Opening price
        }
    }
}

updateStockData();


// MARKET ________________________________________________________________________
// __________________________________________________________________________

const apiKey = "cso30s9r01qkfk5973m0cso30s9r01qkfk5973mg"; 

async function getCompanyInfo() {
const companyName = document.getElementById("company-name").value.trim();
if (!companyName) return alert("Please enter a company name!");

try {
const response = await fetch(`https://finnhub.io/api/v1/search?q=${companyName}&token=${apiKey}`);
const data = await response.json();

if (data.result.length === 0) {
    return alert("Company not found.");
}

const company = data.result[0]; 

// Fetch additional data for the company
const companyDetailsResponse = await fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${company.symbol}&token=${apiKey}`);
const companyDetails = await companyDetailsResponse.json();

displayCompanyInfo(companyDetails);
} catch (error) {
console.error('Error fetching company info:', error);
alert('Error fetching company data.');
}
}

function displayCompanyInfo(company) {
const companyInfoDiv = document.getElementById("company-info");
companyInfoDiv.innerHTML = `
<div class="bg-color-primary-light p-6 rounded-lg shadow-lg">
    <div class="flex items-center mb-6">
        <img src="${company.logo}" alt="Company Logo" class="w-24 h-24 mr-6 rounded-full border-4 border-color-secondary">
        <div>
            <h2 class="text-3xl font-semibold text-color-white">${company.name}</h2>
            <p class="text-xl text-color-secondary">${company.ticker}</p>
        </div>
    </div>
    <div class="text-color-white">
        <p><strong>Country:</strong> ${company.country || 'N/A'}</p>
        <p><strong>Currency:</strong> ${company.currency || 'N/A'}</p>
        <p><strong>Exchange:</strong> ${company.exchange || 'N/A'}</p>
        <p><strong>Industry:</strong> ${company.finnhubIndustry || 'N/A'}</p>
        <p><strong>IPO Date:</strong> ${company.ipo || 'N/A'}</p>
        <p><strong>Market Capitalization:</strong> ${company.marketCapitalization ? `$${company.marketCapitalization.toLocaleString()}` : 'N/A'}</p>
        <p><strong>Phone:</strong> ${company.phone || 'N/A'}</p>
        <p><strong>Outstanding Shares:</strong> ${company.shareOutstanding ? company.shareOutstanding.toLocaleString() : 'N/A'}</p>
        <p><strong>Website:</strong> <a href="${company.weburl}" target="_blank" class="text-color-secondary hover:underline">${company.weburl}</a></p>
    </div>
</div>
`;
}

// LOGIC TO SHOW CONTENTS WHEN BUTTON CLICKS ________________________
function showContent(contentId) {
   
    const contentIds = ['crypto-content', 'stocks-content', 'market-content'];

   
    contentIds.forEach(id => {
        const content = document.getElementById(id);
        if (id === contentId) {
            content.classList.remove('hidden'); 
        } else {
            content.classList.add('hidden'); 
        }
    });
}
