# SmartPrice
Average/aggregate price return from specified exchanges for smart contract cryptocurrencies

# About
Uses the [CCXT](https://github.com/ccxt/ccxt) library to simplify API calls. Uses the average ticker price from each exchange if available, otherwise uses average of last ask and last bid.

# Installation/Usage

smartprice can be cloned and ran from the source, or can be installed as an npm module. We describe the npm installation/usage below. First, install the package in your working directory like so:

```
npm install smartprice --save
```

Require and use smartprice in your project. There is currently only one method and one property right now. Typical usage would be to call the `updatePrice` function, which takes two parameters and returns an ES6 Promise. The two parameters are an array of currency pairs to update, and an optional array of exchanges to exclude. Ex:

```javascript
const sp = require('smartprice');

// update the price of ETH/USD crypto pair, and exclude the 'kraken' exchange from pricing
sp.updatePrice(['ETH/USD'], ['kraken']).then(result => {
  console.log(result);
});

/* Example Output:
{ 'ETH/USD':
  { bitstamp: 1147.6399999999999,
    gemini: 1145.175,
    dsx: 1098.901098901099,
    bitfinex: 1156.7,
    avgPrice: 1138.3, // average price rounded to two decimal places (ideal for fiat pairs)
    avgPricePrecise: 1138.30021978, // average price rounded to eight decimal places (common precision amongst cryptos)
    date: 2018-02-01T05:38:42.103Z
  }
}
*/
```

priceObj can be read repeatedly without out consequence, but calling updatePrice too often has the chance to trigger API rate-limiting by different exchanges.

# Currently supported

Currently only looks up crypto pairs using Bitstamp, Kraken, Bitfinex, GDAX, Gemini, Binance, DSX, HuobiPro, CEX.IO, and Poloniex exchanges as price sources.
