   
const manageBtn = document.getElementById("manage-btn");
const manageDropdown = document.getElementById("manage-dropdown");


manageBtn.addEventListener("click", (e) => {
  e.stopPropagation(); 
  manageDropdown.classList.toggle("hidden");
});


document.addEventListener("click", () => {
  manageDropdown.classList.add("hidden");
});


manageDropdown.addEventListener("mouseenter", () => {
  manageDropdown.classList.remove("hidden");
});


manageDropdown.addEventListener("mouseleave", () => {
  manageDropdown.classList.add("hidden");
});

// USERNAME COOKIES SET____________________________________________________________________


function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
    return null; 
}

// Get username from cookies
let username = getCookie("username");


if (username && username.trim() !== "") {
    document.getElementById("username").innerText = username;
} else {
    document.getElementById("username").innerText = "Guest"; 
}

// ___________________________________________________________________________________________
document.addEventListener('DOMContentLoaded', () => {
    const userProfile = document.getElementById('userProfile');
    const logoutButton = document.getElementById('logoutButton');
  
   
    userProfile.addEventListener('click', () => {
      logoutButton.classList.toggle('hidden');
    });
  
    // Logout and redirect
    logoutButton.addEventListener('click', async () => {
      try {
     
        await fetch('http://localhost:4000/logout', {
          method: 'POST',
          credentials: 'include', 
        });
  
        // Redirect to login.html on the Apache server
        window.location.href = 'http://localhost/project/login.html'; 
      } catch (error) {
        console.error('Logout failed:', error);
      }
    });
  });
  

  // _______________________________________________________________________________________
// DATA SECTION OF STOCK , CRYPTO AND NEWS _________________________________________________
       
       const buttons = document.querySelectorAll('.results-btn button');
       
       // Select each content container
       const stocksContainer = document.querySelector('.stocks-cont');
       const cryptoContainer = document.querySelector('.crypto-cont');
       const newsContainer = document.querySelector('.news-cont');
       
       // Function to handle button clicks
       buttons.forEach((button) => {
           button.addEventListener('click', () => {
       
               // Hide all containers
               stocksContainer.classList.add('hidden');
               cryptoContainer.classList.add('hidden');
               newsContainer.classList.add('hidden');
       
               
               if (button.classList.contains('stocks-btn')) {
                   stocksContainer.classList.remove('hidden');
               } else if (button.classList.contains('crypto-btn')) {
                   cryptoContainer.classList.remove('hidden');
               } else if (button.classList.contains('news-btn')) {
                   newsContainer.classList.remove('hidden');
               }
           });
       });
       
       // _______________________________________________________________________________________
       // CRYPTO FETCHING PRICES ( COINGECKO)  _______________________________

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
                
         
                if (symbol === 'bitcoin') {
                    document.getElementById('bitcoin2-price').textContent = `$${crypto.current_price.toLocaleString()}`;
                } else if (symbol === 'ethereum') {
                    document.getElementById('ethereum2-price').textContent = `$${crypto.current_price.toLocaleString()}`;
                }
    
   
                document.getElementById(`${symbol}-market-cap`).textContent = `$${crypto.market_cap.toLocaleString()}`;
        
    
                document.getElementById(`${symbol}-volume`).textContent = `$${crypto.total_volume.toLocaleString()}`;
        
     
                const changeElement = document.getElementById(`${symbol}-change-24h`);
                const changePercentage = crypto.price_change_percentage_24h;
                
                changeElement.textContent = `${changePercentage.toFixed(2)}%`;
    

                if (changePercentage >= 0) {
                    changeElement.classList.add('text-green-500'); 
                    changeElement.classList.remove('text-red-500'); 
                } else {
                    changeElement.classList.add('text-red-500');
                    changeElement.classList.remove('text-green-500'); 
                }
            });
        
        } catch (error) {
            console.error('Error fetching crypto data:', error);
            
            document.querySelectorAll('.crypto-price, .crypto-market-cap, .crypto-volume, .crypto-change').forEach(el => el.textContent = 'Error');
        }
    }

    fetchCryptoData();
    
       // _________________________________________________________________________________
       // STOCKS FETCHING FROM FINHUB _____________________________________________________

    //    const socket = io.connect('http://localhost:4000');

    
    //    socket.on('stockDataUpdate', (data) => {
       
    //      const stockElement = document.getElementById(${data.symbol.toLowerCase()}-stock);
       
    //      if (stockElement) {
         
    //        const priceElement = stockElement.querySelector(.${data.symbol.toLowerCase()}-price);
    //        if (priceElement) {
    //          priceElement.innerText = $${data.currentPrice.toFixed(2)};
    //        } else {
    //          console.error(Price element not found for ${data.symbol});
    //        }
       
      
    //        const changeElement = stockElement.querySelector(.${data.symbol.toLowerCase()}-change);
    //        if (changeElement) {
    //          changeElement.innerText = ${data.dailyChange >= 0 ? '+' : ''}${data.dailyChange.toFixed(2)};
    //          changeElement.classList.toggle('text-green-500', data.dailyChange >= 0);
    //          changeElement.classList.toggle('text-red-500', data.dailyChange < 0);
    //        } else {
    //          console.error(Change element not found for ${data.symbol});
    //        }
       
       
    //        const pcElement = stockElement.querySelector(.${data.symbol.toLowerCase()}-pc-price);
    //        if (pcElement) {
    //          pcElement.innerText = $${data.previousClose.toFixed(2)};
    //        } else {
    //          console.error(Previous Close element not found for ${data.symbol});
    //        }
    //      } else {
    //        console.error(Stock element for ${data.symbol} not found.);
    //      }
    //    });
    // NOT USING AS SOCKET IO IS EXHAUSTING FREE API _________________________________________________________
           
       document.addEventListener('DOMContentLoaded', async () => {
        try {
          const response = await fetch('http://localhost:4000/api/stocks');
          const stockData = await response.json();
      
          // Update the DOM with the fetched stock data
          Object.keys(stockData).forEach((symbol) => {
            const data = stockData[symbol];
            const stockElement = document.getElementById(`${symbol.toLowerCase()}-stock`);
      
            if (stockElement && data) {
              // Update current price
              const priceElement = stockElement.querySelector(`.${symbol.toLowerCase()}-price`);
              if (priceElement) {
                priceElement.innerText = `$${data.currentPrice.toFixed(2)}`;
              }
      
              // Update daily change
              const changeElement = stockElement.querySelector(`.${symbol.toLowerCase()}-change`);
              if (changeElement) {
                changeElement.innerText = `${data.dailyChange >= 0 ? '+' : ''}${data.dailyChange.toFixed(2)}`;
                changeElement.classList.toggle('text-green-500', data.dailyChange >= 0);
                changeElement.classList.toggle('text-red-500', data.dailyChange < 0);
              }
      
              // Update previous close price
              const pcElement = stockElement.querySelector(`.${symbol.toLowerCase()}-pc-price`);
              if (pcElement) {
                pcElement.innerText = `$${data.previousClose.toFixed(2)}`;
              }
            } else {
              console.error(`Stock element for ${symbol} not found or data is missing.`);
            }
          });
        } catch (error) {
          console.error('Error fetching stock data:', error);
        }
      });
      
       
           // _____________________________________________________________________________________________
           //  NEWS FROM NEWSAPI ___________________________________________________________________________
       
          
       async function getNews() {
           try {
               const response = await fetch('/api/news'); 
               const news = await response.json(); 
       
               const newsContainer = document.getElementById('news-container'); 
               newsContainer.innerHTML = ''; 
              
               news.forEach(article => {
                   const articleElement = document.createElement('div');
                   articleElement.classList.add('bg-white', 'p-2', 'rounded-lg', 'shadow-md');
                   articleElement.innerHTML = `
                       <h2 class="font-semibold text-lg text-black">${article.title}</h2>
                       <p class="text-sm text-black mb-2">Source: ${article.source.name}</p>
                       <p class="text-black">${article.description}</p>
                       <a href="${article.url}" target="_blank" class="text-blue-500 mt-2 inline-block">Read more</a>
                   `;
                   newsContainer.appendChild(articleElement);
               });
           } catch (error) {
               console.error('Error loading news:', error);
           }
       }
  
       window.onload = getNews;
       
       // __________________________________________________________________________________________
       // TRADING VIEW CODE _________________________________________________________________________
       
       
       function loadTradingViewWidget(symbols) {
        
               document.getElementById("tradingview-widget").innerHTML = "";
       
           
               let script = document.createElement("script");
               script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
               script.async = true;
               script.innerHTML = JSON.stringify({
                   "symbols": symbols.map((symbol) => [symbol.toUpperCase(), symbol.toUpperCase()]),
                   "width": "100%",
                   "height": 600,
                   "colorTheme": "dark",
                   "isTransparent": false,
                   "locale": "en"
               });
       
               document.getElementById("tradingview-widget").appendChild(script);
           }
       
           document.addEventListener("DOMContentLoaded", function() {
               loadTradingViewWidget(["AAPL"]);
           });
       
           document.getElementById("load-chart").addEventListener("click", function() {
               const symbolInput = document.getElementById("symbol-input").value.trim();
               if (symbolInput) {
                   loadTradingViewWidget([symbolInput]);
               } else {
                   alert("Please enter a valid stock symbol.");
               }
           });