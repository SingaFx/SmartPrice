const ccxt = require("ccxt");

let kraken = new ccxt.kraken();
let bitstamp = new ccxt.bitstamp();
let gdax = new ccxt.gdax();
let gemini = new ccxt.gemini();
let bitfinex = new ccxt.bitfinex();

let thisPriceObj = {};

// courtesy of MDN
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/round
function precisionRound(number, precision) {
  let factor = Math.pow(10, precision);
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
    let hashTable = {};
    if ((excludedExchanges != null) && (excludedExchanges != undefined)) {
      excludedExchanges.forEach(e => {
        hashTable[e] = true;
      });
    }

    function setPriceObjExchange(result, exchange) {
      if (excludedExchanges == null || !hashTable[exchange]) {
        setPriceObj(result, pair[0], exchange);
      }
    }

    thisPriceObj[pair[0]] = {};

    let promises = [
      bitstamp
        .fetchTicker(pair[0])
        .then(result => {
          setPriceObjExchange(result, 'bitstamp');
        })
        .catch((err) => {
          // swallow exception
        }),
      kraken
        .fetchTicker(pair[0])
        .then(result => {
          setPriceObjExchange(result, 'kraken');
          return gdax.fetchTicker(pair[0]);
        })
        .catch((err) => {
          // swallow exception
        }),
      gdax
        .fetchTicker(pair[0])
        .then(result => {
          setPriceObjExchange(result, 'gdax');
          return gemini.fetchTicker(pair[0]);
        })
        .catch((err) => {
          // swallow exception
        }),
      gemini
        .fetchTicker(pair[0])
        .then(result => {
          setPriceObjExchange(result, 'gemini');
          return bitfinex.fetchTicker(pair[0]);
        })
        .catch((err) => {
          // swallow exception
        }),
      bitfinex
        .fetchTicker(pair[0])
        .then(result => {
          setPriceObjExchange(result, 'bitfinex');
        })
        .catch(() => {
          // swallow exception
        })
    ];

    Promise
      .all(promises)
      .then(res => {
        let totalPrice = 0.0;
        let rejects = 0;

        try {
          if (Object.keys(thisPriceObj[pair[0]]).length > 0) {
            while ((thisPriceObj[pair[0]].avgPrice == null) || (thisPriceObj[pair[0]].avgPrice == undefined)) {
              for (const obj in thisPriceObj[pair[0]]) {
                if (thisPriceObj[pair[0]].hasOwnProperty(obj)) {
                  if (!isNaN(thisPriceObj[pair[0]][obj])) {
                    totalPrice += thisPriceObj[pair[0]][obj];
                  } else {
                    rejects++;
                  }
                }
              }

              thisPriceObj[pair[0]].avgPrice = precisionRound((totalPrice / (Object.keys(thisPriceObj[pair[0]]).length - rejects)), 2);
              thisPriceObj[pair[0]].date = new Date();
            }
          } else {
            delete thisPriceObj[pair[0]];
          }
        } catch (err) {
          // error trying to calculate avgPrice, reject the promise with the error
          reject(err);
        }
        if (pair.length > 1) {
          pair.splice(0, 1);
          resolve(updatePrice(pair, excludedExchanges));
        } else {
          resolve(thisPriceObj);
        }
      })
      .catch(err => {
        // error running through our promises, reject the promise with the error
        reject(err);
      });
  });
}

module.exports = {
  priceObj: thisPriceObj,
  updatePrice: updatePrice
}
