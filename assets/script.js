var cs_price = document.querySelector("#cs_price");
var cs_symbol = document.querySelector("#cs_symbol");
var cs_desc = document.querySelector("#cs_desc");
var cc_price = document.querySelector("#cc_price");
var cc_symbol = document.querySelector("#cc_symbol");
var cc_desc = document.querySelector("#cc_desc");
var ys_price = document.querySelector("#ys_price");
var ys_symbol = document.querySelector("#ys_symbol");
var market_news = document.querySelector("#market_news");
var company_news = document.querySelector("#company_news");
var company_button = document.querySelector("#company_button");
var stock_button = document.querySelector("#stock-button");
var stock_lookup = document.querySelector("#stock-lookup");
var crypto_button = document.querySelector("#crypto-button");
var crypto_lookup = document.querySelector("#crypto-lookup");
var modal = document.querySelector(".modal");
var modalBg = document.querySelector(".modal-background");
let modalBody = document.querySelector('#modal-body');
var userSymbols = [];

async function getCommonStocks() {
  var priceList = document.createElement("ul");
  var symbolList = document.createElement("ul");
  var descList = document.createElement("ul");

  const stocks = [
    "AAPL",
    "AMZN",
    "NVDA",
    "NFLX",
    "MU",
    "M",
    "BABA",
    "SNOW",
    "TSLA",
    "TNDM",
    "NKLA",
    "NIO",
    "TGT",
  ];

  // let s = await getStockSymbol()
  for (var i = 0; i < stocks.length; i++) {
    let symbol = stocks[i];
    let price = await getPrice(symbol);
    let profile = await getWebsiteURL(symbol);

    var pli = document.createElement("li");
    var sli = document.createElement("li");
    // var uli = document.createElement('li');
    var dli = document.createElement("li");

    var aTag = document.createElement("a");
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

async function getYourStocks() {
  if (localStorage.getItem("stockSymbols")) {
    userSymbols = JSON.parse(localStorage.getItem("stockSymbols"));
  }
  var priceList = document.createElement("ul");
  var symbolList = document.createElement("ul");

  // let s = await getStockSymbol()
  for (var i = 0; i < userSymbols.length; i++) {
    let symbol = userSymbols[i];
    let price = await getPrice(symbol);
    let profile = await getWebsiteURL(symbol);

    var pli = document.createElement("li");
    var sli = document.createElement("li");

    var aTag = document.createElement("a");
    sli.appendChild(aTag);

    pli.textContent = price.c;
    aTag.textContent = symbol;
    aTag.href = profile.weburl;

    priceList.appendChild(pli);
    symbolList.appendChild(sli);
  }
  ys_price.appendChild(priceList);
  ys_symbol.appendChild(symbolList);
  // ys_desc.appendChild(descList);
}

async function addNewStock() {
  var priceList = document.createElement("ul");
  var symbolList = document.createElement("ul");

  let symbol = userSymbols[userSymbols.length - 1];
  let price = await getPrice(symbol);
  let profile = await getWebsiteURL(symbol);

  var pli = document.createElement("li");
  var sli = document.createElement("li");

  var aTag = document.createElement("a");
  sli.appendChild(aTag);

  pli.textContent = price.c;
  aTag.textContent = symbol;
  aTag.href = profile.weburl;

  priceList.appendChild(pli);
  symbolList.appendChild(sli);

  ys_price.appendChild(priceList);
  ys_symbol.appendChild(symbolList);
  // ys_desc.appendChild(descList);
}

async function getStockSymbol() {
  var symbolURL =
    "https://finnhub.io/api/v1/stock/symbol?exchange=US&token=c9sqnaqad3ib0ug2vn2g&mic=XNAS&currency=USD";
  const symbolResponse = (await fetch(symbolURL)).json();
  return symbolResponse;
}

async function getPrice(symbol) {
  var priceURL =
    "https://finnhub.io/api/v1/quote?symbol=" +
    symbol +
    "&token=c9sqnaqad3ib0ug2vn2g";
  const priceResponse = (await fetch(priceURL)).json();
  return priceResponse;
}

async function getWebsiteURL(symbol) {
  var profileURL =
    "https://finnhub.io/api/v1/stock/profile2?symbol=" +
    symbol +
    "&token=c9sqnaqad3ib0ug2vn2g";
  const profileResponse = (await fetch(profileURL)).json();
  return profileResponse;
}

async function getCompanyNews(symbol) {
  var companyNews =
    "https://finnhub.io/api/v1/company-news?symbol=" +
    symbol +
    "&from=2022-05-11&to=2022-05-12&token=c9sqnaqad3ib0ug2vn2g";
  var newList = document.createElement("ol");
  var state = company_news.getAttribute("data-state");
  fetch(companyNews)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      if (data.length === 0) {
        errorHandler('news', symbol);
        return;
      }
      for (let i = 0; i < 3; i++) {
        // console.log(data[i].headline);
        var nli = document.createElement("li");
        var aTag = document.createElement("a");
        nli.appendChild(aTag);
        aTag.textContent = data[i].headline;
        aTag.href = data[i].url;
        newList.appendChild(nli);
      }
      // debugger;
    if (state === "hidden") {
      //default
      newList.setAttribute("id", "current-list");
      company_news.appendChild(newList);
      company_news.dataset.state = "visible";
    } else {
      var oldList = document.querySelector("#current-list");
      company_news.replaceChild(newList, oldList);
      // company_news.dataset.state = "hidden";
    }
    newList.setAttribute("id", "current-list");
    });
}

function getMarketNews() {
  var marketNews =
    "https://finnhub.io/api/v1/news?category=general&token=c9sqnaqad3ib0ug2vn2g";
  const newList = document.createElement("ol");
  fetch(marketNews)
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        var nli = document.createElement("li");
        var aTag = document.createElement("a");
        nli.appendChild(aTag);
        aTag.textContent = data[i].headline;
        aTag.href = data[i].url;
        newList.appendChild(nli);
      }
    });
  market_news.appendChild(newList);
}

async function getYourCrypto() {
  //   let modalCardContainer = document.querySelector("#modal-card-container");
      let query = crypto_lookup.value;
      let url = "https://api.coingecko.com/api/v3/search?query=" + query;
      var response = await fetch(url);
      var data = await response.json();
      
      if (data.coins.length === 0) {
        errorHandler("crypto", query);
        return;
      }

      let modalMsg = document.querySelector('#modal-msg');
      modalMsg.textContent = "Did you mean: ";
      let modalContainer = document.createElement('div');
      modalContainer.classList.add('columns', 'box');
      modalContainer.setAttribute('id', 'modal-container');
      
      for(let i = 0; i < 3; i++) {
          let column = document.createElement('div');
          column.classList.add('column', 'is-4-tablet', 'is-3-tablet');
          column.setAttribute('id', 'crypto-column-' + (i + 1));
          modalContainer.appendChild(column);
      }
      modalBody.appendChild(modalContainer);
  
      for (let i = 0; i < data.coins.length; i++) {
          console.log(data.coins[i].name);
          let column = document.querySelector('#crypto-column-' + ((i % 3) + 1) )

          let card = document.createElement('div');
          card.classList.add('card', 'has-background-grey-light');

          let cardImgDiv = document.createElement('div');
          cardImgDiv.classList.add("card-image", "has-text-centered", "px-6", "py-2", 'has-background-white');
          let cardImg = document.createElement('img');
          cardImg.src = data.coins[i].large;
          
          let cardContentDiv = document.createElement('div');
          cardContentDiv.classList.add('card-content');
          let cardSym = document.createElement('p');
          cardSym.classList.add('has-text-weight-bold');
          cardSym.textContent = data.coins[i].symbol;
          let cardName = document.createElement('p');
          cardName.classList.add('has-text-centered')
          cardName.textContent = data.coins[i].name;
          
          cardImgDiv.append(cardImg, cardSym);
          cardContentDiv.appendChild(cardName);
          card.append(cardImgDiv, cardContentDiv);
          column.appendChild(card);
      }
      modal.classList.add("is-active");
}

function getCrypto () {
    var priceList = document.createElement("ul");
    var symbolList = document.createElement("ul");
    var descList = document.createElement("ul");
    let url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

    fetch(url)
        .then((data) => {
            return data.json();
        })
        .then((info) => {
            for (var i = 0; i < info.length; i++) {
                let symbol = info[i].symbol;
                let price = info[i].current_price;
                let name = info[i].name;
            
                var pli = document.createElement("li");
                var sli = document.createElement("li");
                // var uli = document.createElement('li');
                var dli = document.createElement("li");
            
                var pTag = document.createElement("p");
                sli.appendChild(pTag);
            
                pli.textContent = price;
                dli.textContent = name;
                pTag.textContent = symbol.toUpperCase();
            
                priceList.appendChild(pli);
                symbolList.appendChild(sli);
                descList.appendChild(dli);
              }
              cc_price.appendChild(priceList);
              cc_symbol.appendChild(symbolList);
              cc_desc.appendChild(descList);
        })
}

function storageHandler(data) {
  if (stock_lookup.value) {
    data.push(stock_lookup.value);
    localStorage.setItem("stockSymbols", JSON.stringify(data));
  }
}

function errorHandler (err, errVal) {
  switch (err) {
    case "news":
      newsError(errVal);
      break;
    case "stock":
      stockError(errVal);
      break;
    case "crypto":
      cryptoError(errVal);
      break;
  }
}

function closeModal () {

}

function newsError(msg) {
  let modalMsg = document.querySelector('#modal-msg');
  let modalBtn = document.createElement('button');
  // modalBtn.textContent = "OK";
  // modalBtn.addEventListener('click', function () {
  //   modal.classList.remove('is-active');
  //   modalBody.removeChild(modalBtn);
  // })
  modalMsg.textContent = `Couldn't find news for company "${msg}"`;
  // modalBody.appendChild(modalBtn);
  modal.classList.add('is-active');
}

function cryptoError(msg) {
  let modalMsg = document.querySelector('#modal-msg');
  // let modalBtn = document.createElement('button');
  // modalBtn.textContent = "OK";
  // modalBtn.addEventListener('click', function () {
  //   modal.classList.remove('is-active');
  //   modalBody.removeChild(modalBtn);
  // })
  modalMsg.textContent = `Couldn't find coin or token for "${msg}"`;
  // modalBody.appendChild(modalBtn);
  modal.classList.add('is-active');
}

function stockError(msg) {
  let modalMsg = document.querySelector('#modal-msg');
  // let modalBtn = document.createElement('button');
  // modalBtn.textContent = "OK";
  // modalBtn.addEventListener('click', function () {
  //   modal.classList.remove('is-active');
  //   modalBody.removeChild(modalBtn);
  // })
  modalMsg.textContent = `Couldn't find stocks for company "${msg}"`;
  // modalBody.appendChild(modalBtn);
  modal.classList.add('is-active');
}

async function validateStock (stock) {
  var url = `https://finnhub.io/api/v1/company-news?symbol=${stock}&from=2022-05-11&to=2022-05-12&token=c9sqnaqad3ib0ug2vn2g`;
  const response = (await fetch(url)).json();
  return response;
}

getCommonStocks();
getMarketNews();
getYourStocks();
getCrypto();
getCompanyNews("FB");

company_button.addEventListener("click", function () {
  var newsVal = document.querySelector("#company-news").value;
  getCompanyNews(newsVal);
});

stock_button.addEventListener("click", async function () {
  let stockVal = document.querySelector("#stock-lookup").value;
  let valid = await validateStock(stockVal);
  console.log(valid);

  if (valid.length <= 0) {
    errorHandler("stock", stockVal);
    return;
  }
  storageHandler(userSymbols);
  addNewStock();
});

crypto_button.addEventListener("click", function () {
  getYourCrypto();
});

modalBg.addEventListener("click", function () {
    var modalContainer = document.querySelector('#modal-container');
    if (modalContainer) {
        modalBody.removeChild(modalContainer);
    }
    document.querySelector('#modal-msg').textContent = '';
    modal.classList.remove("is-active");
});
