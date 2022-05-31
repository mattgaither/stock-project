var stock_price = document.getElementById("stock_price");
var stock_symbol = document.getElementById("stock_symbol");
var stock_desc = document.getElementById("stock_desc");
var stock_url = document.getElementById("stock_url");
var market_news = document.getElementById("market_news");
var company_news = document.getElementById("company_news");
var company_button = document.querySelector("#company_button");

async function getStocks() {
    var priceList = document.createElement('ul');
    var symbolList = document.createElement('ul');
    var urlList = document.createElement('ul');
    var descList = document.createElement('ul');

    const stocks = ["AAPL", "AMZN", "HD", "DOCU", "NVDA", "NFLX", "MU", "M", "BABA", "SNOW", "TSLA", "TNDM", "NKLA", "NIO", "TGT"];

    // let s = await getStockSymbol()
    for (var i = 0; i < stocks.length; i++) {
        let symbol = stocks[i];
        let price = await getPrice(symbol)
        let profile = await getWebsiteURL(symbol)

        var pli = document.createElement('li');
        var sli = document.createElement('li');
        var uli = document.createElement('li');
        var dli = document.createElement('li');
        
        var aTag = document.createElement('a');
        uli.appendChild(aTag);
        
        pli.textContent = price.c;
        sli.textContent = symbol;
        dli.textContent = profile.name;
        aTag.textContent = profile.weburl;
        aTag.href = profile.weburl;

        priceList.appendChild(pli);
        symbolList.appendChild(sli);
        urlList.appendChild(uli);
        descList.appendChild(dli);
    }
    stock_price.appendChild(priceList);
    stock_symbol.appendChild(symbolList);
    stock_desc.appendChild(descList);
    stock_url.appendChild(urlList);
}

async function getStockSymbol() {
    var symbolURL = 'https://finnhub.io/api/v1/stock/symbol?exchange=US&token=ca270qqad3iaqnc2o93g&mic=XNAS&currency=USD';
    const symbolResponse = (await fetch(symbolURL)).json();
    return symbolResponse
}

async function getPrice(symbol) {
    var priceURL = 'https://finnhub.io/api/v1/quote?symbol=' + symbol + '&token=ca270qqad3iaqnc2o93g';
    const priceResponse = (await fetch(priceURL)).json();
    return priceResponse
}

async function getWebsiteURL(symbol) {
    var profileURL = 'https://finnhub.io/api/v1/stock/profile2?symbol=' + symbol + '&token=ca270qqad3iaqnc2o93g';
    const profileResponse = (await fetch(profileURL)).json();
    return profileResponse
}

async function getCompanyNews(symbol) {
    var companyNews = 'https://finnhub.io/api/v1/company-news?symbol='+symbol+'&from=2022-05-11&to=2022-05-12&token=ca270qqad3iaqnc2o93g';
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
    var marketNews = 'https://finnhub.io/api/v1/news?category=general&token=ca270qqad3iaqnc2o93g';
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

getStocks();
getMarketNews();
getCompanyNews("FB");

company_button.addEventListener("click", function() {
    console.log("hello");
    getCompanyNews("AAPL");
  });