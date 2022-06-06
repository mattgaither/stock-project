var cs_price = document.querySelector("#cs_price");
var cs_symbol = document.querySelector("#cs_symbol");
var cs_desc = document.querySelector("#cs_desc");
var ys_price = document.querySelector("#ys_price");
var ys_symbol = document.querySelector("#ys_symbol");
var market_news = document.querySelector("#market_news");
var company_news = document.querySelector("#company_news");
var company_button = document.querySelector("#company_button");
var stock_button = document.querySelector("#stock-button");
var stock_lookup = document.querySelector("#stock-lookup");

async function getCommonStocks() {
    var priceList = document.createElement('ul');
    var symbolList = document.createElement('ul');
    var descList = document.createElement('ul');

    const stocks = ["AAPL", "AMZN", "NVDA", "NFLX", "MU", "M", "BABA", "SNOW", "TSLA", "TNDM", "NKLA", "NIO", "TGT"];

    // let s = await getStockSymbol()
    for (var i = 0; i < stocks.length; i++) {
        let symbol = stocks[i];
        let price = await getPrice(symbol)
        let profile = await getWebsiteURL(symbol)

        var pli = document.createElement('li');
        var sli = document.createElement('li');
        // var uli = document.createElement('li');
        var dli = document.createElement('li');
        
        var aTag = document.createElement('a');
        sli.appendChild(aTag);
        
        pli.textContent = price.c;
        dli.textContent = profile.name;
        aTag.textContent = symbol;
        aTag.href = profile.weburl;

        priceList.appendChild(pli);
        symbolList.appendChild(sli);
        descList.appendChild(dli);
    }
    cs_price.appendChild(priceList);
    cs_symbol.appendChild(symbolList);
    cs_desc.appendChild(descList);
}

async function getYourStocks () {
    var priceList = document.createElement('ul');
    var symbolList = document.createElement('ul');
    var descList = document.createElement('ul');

    // let s = await getStockSymbol()
    for (var i = 0; i < stocks.length; i++) {
        let symbol = stocks[i];
        let price = await getPrice(symbol)
        let profile = await getWebsiteURL(symbol)

        var pli = document.createElement('li');
        var sli = document.createElement('li');
        // var uli = document.createElement('li');
        var dli = document.createElement('li');
        
        var aTag = document.createElement('a');
        sli.appendChild(aTag);
        
        pli.textContent = price.c;
        dli.textContent = profile.name;
        aTag.textContent = symbol;
        aTag.href = profile.weburl;

        priceList.appendChild(pli);
        symbolList.appendChild(sli);
        // urlList.appendChild(uli);
        descList.appendChild(dli);
    }
    ys_price.appendChild(priceList);
    ys_symbol.appendChild(symbolList);
    // ys_desc.appendChild(descList);
}

async function getStockSymbol() {
    var symbolURL = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c9sqnaqad3ib0ug2vn2g&mic=XNAS&currency=USD';
    const symbolResponse = (await fetch(symbolURL)).json();
    return symbolResponse
}

async function getPrice(symbol) {
    var priceURL = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=c9sqnaqad3ib0ug2vn2g';
    const priceResponse = (await fetch(priceURL)).json();
    return priceResponse
}

async function getWebsiteURL(symbol) {
    var profileURL = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + symbol + '&token=c9sqnaqad3ib0ug2vn2g';
    const profileResponse = (await fetch(profileURL)).json();
    return profileResponse
}

async function getCompanyNews(symbol) {
    var companyNews = 'https://finnhub.io/api/v1/company-news?symbol='+symbol+'&from=2022-05-11&to=2022-05-12&token=c9sqnaqad3ib0ug2vn2g';
    var newList = document.createElement('ol');
    var state = company_news.getAttribute("data-state");
    fetch(companyNews)
    .then((resp) => {
        return resp.json()
      }).then((data) => {
        for ( let i=0;  i< 3;  i++){
            console.log(data[i].headline);
            var nli = document.createElement('li');
            var aTag = document.createElement('a');
            nli.appendChild(aTag);
            aTag.textContent = data[i].headline;
            aTag.href = data[i].url;
            newList.appendChild(nli);
        }
    });
    if (state === "hidden"){
        //default
        company_news.appendChild(newList);
        company_news.dataset.state = "visible";
    } else {
        company_news.replaceChild();
        company_news.appendChild(newList);
        company_news.dataset.state = "hidden";
    }
   
}

function getMarketNews() {
    var marketNews = 'https://finnhub.io/api/v1/news?category=general&token=c9sqnaqad3ib0ug2vn2g';
    const newList = document.createElement('ol');
    fetch(marketNews)
    .then((resp) => {
        return resp.json()
      }).then((data) => {
        for ( let i=0;  i< data.length;  i++){
            var nli = document.createElement('li');
            var aTag = document.createElement('a');
            nli.appendChild(aTag);
            aTag.textContent = data[i].headline;
            aTag.href = data[i].url;
            newList.appendChild(nli);
        }
    });
    market_news.appendChild(newList);
}

getCommonStocks();
getMarketNews();
getCompanyNews("FB");

company_button.addEventListener("click", function() {
    console.log("hello");
});

stock_button.addEventListener("click", async function() {
    var userSymbols = [];
    if (localStorage.getItem("stockSymbols")) {
        var userSymbols = JSON.parse(localStorage.getItem("stockSymbols"));
    }

    if (stock_lookup.value) {
        userSymbols.push(stock_lookup.value);
        localStorage.setItem("stockSymbols", JSON.stringify(userSymbols));
    }
    for (var i = 0; i < userSymbols.length; i++) {
        console.log(userSymbols[i]);
    }
});