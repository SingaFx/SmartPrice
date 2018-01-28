const ccxt = require("ccxt");

var kraken = new ccxt.kraken();
var bitstamp = new ccxt.bitstamp();
var gdax = new ccxt.gdax();
var gemini = new ccxt.gemini();
var bitfinex = new ccxt.bitfinex();

var thisPriceObj = {};

// courtesy of MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}

function setPriceObj(result, pair, exchange) {
  if (result.average != undefined) {
    thisPriceObj[pair][exchange] = result.average;
  } else if (result.ask && result.bid) {
    thisPriceObj[pair][exchange] = (result.ask + result.bid) / 2;
  }
}

/**
 * Update given pair(s) of currencies, while excluding certain exchanges
 *
 * @param {any} pair - array of pair(s) of currencies to looks up. e.g: ['ETH/USD']. ['ETH/USD', 'BTC/USD']
 * @param {any} excludedExchanges - optional array of exchanges to exclude in pricing, by name. e.g: ['bitfinex']. ['bitfinex', 'kraken']
 * @returns priceObj
 */
function updatePrice(pair, excludedExchanges) {
  return new Promise((resolve, reject) => {
    thisPriceObj[pair[0]] = {};
    resolve(bitstamp.fetchTicker(pair[0])
    .then(result => {
      if ((excludedExchanges == null) || (excludedExchanges.indexOf('bitstamp') == -1)) {
        setPriceObj(result, pair[0], 'bitstamp');
      }
      return kraken.fetchTicker(pair[0]);
    })
    .catch((err) => {
      return kraken.fetchTicker(pair[0]);
    })
    .then(result => {
      if ((excludedExchanges == null) || (excludedExchanges.indexOf('kraken') == -1)) {
        setPriceObj(result, pair[0], 'kraken');
      }
      return gdax.fetchTicker(pair[0]);
    })
    .catch((err) => {
      return gdax.fetchTicker(pair[0]);
    })
    .then(result => {
      if ((excludedExchanges == null) || (excludedExchanges.indexOf('gdax') == -1)) {
        setPriceObj(result, pair[0], 'gdax');
      }
      return gemini.fetchTicker(pair[0]);
    })
    .catch((err) => {
      return gemini.fetchTicker(pair[0]);
    })
    .then(result => {
      if ((excludedExchanges == null) || (excludedExchanges.indexOf('gemini') == -1)) {
        setPriceObj(result, pair[0], 'gemini');
      }
      return bitfinex.fetchTicker(pair[0]);
    })
    .catch((err) => {
      return bitfinex.fetchTicker(pair[0]);
    })
    .then(result => {
      if ((excludedExchanges == null) || (excludedExchanges.indexOf('bitfinex') == -1)) {
        setPriceObj(result, pair[0], 'bitfinex');
      }
    })
    .catch(() => {
      // swallow exception
    })
    .then(() => {
      var totalPrice = 0.0;
      var rejects = 0;

      try {
        if (Object.keys(thisPriceObj[pair[0]]).length > 0) {
          for (const obj in thisPriceObj[pair[0]]) {
            if (!isNaN(thisPriceObj[pair[0]][obj])) {
              totalPrice += thisPriceObj[pair[0]][obj];
            } else {
              rejects++;
            }
          }

          thisPriceObj[pair[0]].avgPrice = precisionRound((totalPrice / (Object.keys(thisPriceObj[pair[0]]).length - rejects)), 2);
          thisPriceObj[pair[0]].date = new Date();
        }
        else {
          delete thisPriceObj[pair[0]];
        }
      }
      catch (err) {
        // swallow exception
      }

      if (pair.length > 1) {
        pair.splice(0,1);
        return updatePrice(pair, excludedExchanges);
      }
      else {
        return thisPriceObj;
      }
    }));
  });
}

module.exports.priceObj = thisPriceObj;

module.exports.updatePrice = updatePrice;
