# SmartPrice
Aggregate price return from chosen exchanges for smart contract cryptocurrencies

# About
Uses the [CCXT](https://github.com/ccxt/ccxt) library to simplify API calls. Uses the average ticker price from each Exchange if available, otherwise uses the price of the last trade.
Currently averages these exchanges: kraken, bitstamp, bitfinex, gemini
