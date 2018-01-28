# SmartPrice
Aggregate price return from specified exchanges for smart contract cryptocurrencies

# About
Uses the [CCXT](https://github.com/ccxt/ccxt) library to simplify API calls. Uses the average ticker price from each Exchange if available, otherwise uses average of last ask and last bid.

# Installation/Usage

Clone the repo, `cd` in the directory, then run:

```
npm install
```

Require or import SmartPrice into your project. There is currently only one method and one property right now. Typical usage would be to call the `updatePrice` function, which takes two parameters and returns an ES6 Promise. The two parameters are an array of currency pairs to update, and an optional array of exchanges to exclude. Ex:

```javascript
const sp = require('<GIT REPO>/smartPrice');

// update the price of ETH/USD crypto pair, and exclude the 'kraken' exchange from pricing
sp.updatePrice(['ETH/USD'], ['kraken']).then(result => {
  console.log(result);
});

/* Example Output:
{ 'ETH/USD':
  { bitstamp: 1177.545,
    gdax: 1139.9850000000001,
    gemini: 1153.875,
    bitfinex: 1192.05,
    avgPrice: 1165.86,
    date: 2018-01-28T06:46:55.784Z
  }
}
*/
```

priceObj can be read repeatedly without out consequence, but calling updatePrice too often has the chance to trigger API rate-limiting by different exchanges.

# Currently supported

Currently only looks up price of Ethereum using Bitstamp, Kraken, Bitfinex, GDAX and Gemini exchanges as price sources.

# Coming Soon
Support for more exchanges.
