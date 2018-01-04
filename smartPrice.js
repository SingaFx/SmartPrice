const rp = require("request-promise");

/*
    { high: '709.31',
      last: '696.01',
      timestamp: '1514702383',
      bid: '696.00',
      vwap: '700.56',
      volume: '701.00209298',
      low: '696.01',
      ask: '697.33',
      open: '697.03' }
*/
const bitStampUrl = "https://www.bitstamp.net/api/v2/ticker_hour/ethusd/";

/*
    a = ask array(<price>, <whole lot volume>, <lot volume>),
    b = bid array(<price>, <whole lot volume>, <lot volume>),
    c = last trade closed array(<price>, <lot volume>),
    v = volume array(<today>, <last 24 hours>),
    p = volume weighted average price array(<today>, <last 24 hours>),
    t = number of trades array(<today>, <last 24 hours>),
    l = low array(<today>, <last 24 hours>),
    h = high array(<today>, <last 24 hours>),
    o = today's opening price
*/
const krakenUrl = "https://api.kraken.com/0/public/Ticker?pair=ETHUSD";

/*
    { mid: '692.9',
      bid: '692.87',
      ask: '692.93',
      last_price: '693.21',
      low: '640.43',
      high: '702.99',
      volume: '227910.27266435',
      timestamp: '1514704295.415888' }
*/
const bitfinexUrl = "https://api.bitfinex.com/v1/pubticker/ethusd";

/*
    { data: { base: 'ETH', currency: 'USD', amount: '706.01' } }
*/
const coinbaseUrl = "https://api.coinbase.com/v2/prices/ETH-USD/spot";

/*
    {"bid":"702.63","ask":"702.64","volume":{"ETH":"37693.76042157","USD":"26668896.1640428922","timestamp":1514706600000},"last":"702.63"}
*/
const geminiUrl = "https://api.gemini.com/v1/pubticker/ethusd";

/*
    {"ask":"728.87","bid":"727.66","last":"728.61","open":"689.75","low":"681.69","high":"744.00","volume":"12579.350","volumeQuote":"8965307.97029","timestamp":"2018-01-01T00:29:46.564Z","symbol":"ETHUSD"}
*/
const hitbtcUrl = "https://api.hitbtc.com/api/2/public/ticker/ETHUSD";

var thisPriceObj = {};

var rpPromise = rp({
    uri: bitStampUrl,
    simple: false
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.last))) {
        thisPriceObj['bitStampPrice'] = parseFloat(json.last);
      }
    } catch (ex) {
      // swallow exception
    }
    return rp({
      uri: krakenUrl,
      simple: false
    });
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.result.XETHZUSD.c[0]))) {
        thisPriceObj['krakenPrice'] = parseFloat(json.result.XETHZUSD.c[0]);
      }
    } catch (ex) {
      // swallow exception
    }
    return rp({
      uri: bitfinexUrl,
      simple: false
    });
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.last_price))) {
        thisPriceObj['bitfinexPrice'] = parseFloat(json.last_price);
      }
    } catch (ex) {
      // swallow exception
    }
    return rp({
      uri: coinbaseUrl,
      simple: false
    });
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.data.amount))) {
        thisPriceObj['coinbasePrice'] = parseFloat(json.data.amount);
      }
    } catch (ex) {
      // swallow exception
    }
    return rp({
      uri: geminiUrl,
      simple: false
    });
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.last))) {
        thisPriceObj['geminiPrice'] = parseFloat(json.last);
      }
    } catch (ex) {
      // swallow exception
    }
    return rp({
      uri: hitbtcUrl,
      simple: false
    });
  })
  .then((htmlString) => {
    try {
      let json = JSON.parse(htmlString);
      if (!isNaN(parseFloat(json.last))) {
        thisPriceObj['hitbtcPrice'] = parseFloat(json.last);
      }
    } catch (ex) {
      // swallow exception
    }
  })
  .catch((err) => {
    console.log('Error occurred: ' + err);
  })
  .finally(() => {
    var totalPrice = 0.0;
    var rejects = 0;

    for (const obj in thisPriceObj) {
      if (!isNaN(thisPriceObj[obj])) {
        totalPrice += thisPriceObj[obj];
      }
      else {
        rejects++;
      }
    }

    thisPriceObj['totalPrice'] = (totalPrice / (Object.keys(thisPriceObj).length - rejects)).toFixed(2);
  });

var thisPromise = new Promise((resolve, reject) => {
  thisPriceObj = {};
  resolve(rpPromise);
})

module.exports.priceObj = thisPriceObj;

module.exports.updatePrice = thisPromise;
