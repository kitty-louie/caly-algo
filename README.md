# Caly-Algo

Retrieves stock quote and metrics on console.

## Installing / Getting started

```shell
npm install
```

### Initial Configuration

```shell
mkdir config
touch tickers.js
touch iex.js
```

In `tickers.js` enter ticker list.

```json
module.exports = {
  HOLDINGS: ['AAAU', 'AAPL', 'ABBV', 'AMZN'],
  WATCH_LIST: ['TSLA', 'AAPL', 'BLNK']
}
```

In `iex.js` enter IEX Cloud Credentials.

```json
module.exports = {
    // production
    // IEX_API_URL: 'https://cloud.iexapis.com',
    // IEX_API_TOKEN: 'pk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // IEX_API_SECRET_TOKEN: 'sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // IEX_API_SECRET_VERSION: 'v1',
    // IEX_API_ENV: 'cloud',

    // sandbox
    IEX_API_URL: 'https://sandbox.iexapis.com',
    IEX_API_TOKEN: 'Tpk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    IEX_API_SECRET_TOKEN: 'Tsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    IEX_API_SECRET_VERSION: 'v1',
    IEX_API_ENV: 'sandbox'
}
```

Run code `node index.js --iex`

## Features

What's all the bells and whistles this project can perform?
* Retrieve stock ticker quote
* Generate technical metrics (ie. ema8, ema20, ema50, ema200, wma8, wma20, wma50, wma200, rsi8, rsi20, rsi50, rsi200)
* Display on console
## Licensing

"The code in this project is licensed under MIT license."