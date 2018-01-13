# SmartPrice
Aggregate price return from specified exchanges for smart contract cryptocurrencies

# About
Uses the [CCXT](https://github.com/ccxt/ccxt) library to simplify API calls. Uses the average ticker price from each Exchange if available, otherwise uses average of last ask and last bid.

# Installation/Usage

Clone the repo, `cd` in the directory, then run:

```
npm install
```

Require or import SmartPrice into your project. There is currently only one method and one property right now. Typical usage would be to call the `updatePrice` function, which returns an ES6 Promise and can be used to then call the `priceObj` property. Ex:

```javascript
const sp = require('<GIT REPO>/smartPrice');

sp.updatePrice.then(function() {
  console.log(sp.priceObj);
});

/* Example Output:
{ bitstamp: 1335.54,
  bitfinex: 1332.45,
  gemini: 1332.335,
  avgPrice: 1333.44 }
*/
```

priceObj can be read repeatedly without out consequence, but calling updatePrice too often has the chance to trigger API rate-limiting by different exchanges.

# Currently supported

Currently only looks up price of Ethereum using Bitstamp, Kraken, Bitfinex and Gemini exchanges as price sources.

# Coming Soon
Aggregrate pricing for more cryptocurrencies (which focus on smart contracts), as well as support for more exchanges.