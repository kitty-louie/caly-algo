const fetch = require('node-fetch')
const TI = require('technicalindicators')
const { Table } = require('console-table-printer')
const util = require('util')

const { IEX_API_URL, IEX_API_TOKEN, IEX_API_SECRET_VERSION } = require('../config/iex')
const TICKER_LISTS = require('../config/tickers')

// compiles a ticker list without duplicates in order to retrieve data from iex api
const compileTickersToRetrieveData = (tickerObj) => {
  let compileTickerArray = []
  Object.values(tickerObj).forEach(list => {
    compileTickerArray = compileTickerArray.concat(list)
  })

  // removes duplicates
  const uniqueSet = new Set(compileTickerArray)

  // returns array
  return [...uniqueSet]
}

// call iex for data
const fetchQuoteAndHistory = (ticker, index) => {
  return new Promise((resolve, reject) => {
    // use setTimeout to avoid rate limiting
    // https://iexcloud.io/docs/api/#request-limits
    setTimeout(() => {
      // https://iexcloud.io/docs/api/#quote
      fetch(`${IEX_API_URL}/${IEX_API_SECRET_VERSION}/stock/${ticker}/quote?token=${IEX_API_TOKEN}`)
        .then(quoteRes => {
          // check to make sure json is returned...otherwise could be error page
          const contentType = quoteRes.headers.get('content-type')
          if (contentType && contentType.indexOf('application/json') !== -1) {
            return quoteRes.json()
          } else {
            throw new Error(`Quote ${quoteRes.text()}`)
          }
        })
        .then(quoteData => {
          // console.log(quoteData)
          const data = quoteData

          setTimeout(() => {
          // console.log('chart')
          // https://iexcloud.io/docs/api/#historical-prices
            fetch(`${IEX_API_URL}/${IEX_API_SECRET_VERSION}/stock/${ticker}/chart/5y?token=${IEX_API_TOKEN}`)
              .then(historicalRes => {
                // check to make sure json is returned...otherwise could be error page
                const contentType = historicalRes.headers.get('content-type')
                if (contentType && contentType.indexOf('application/json') !== -1) {
                  return historicalRes.json()
                } else {
                  throw new Error(`Historical ${historicalRes.text()}`)
                }
              })
              .then(historicalData => {
                // console.log(historicalData)
                data.historical = historicalData
                resolve(data)
              }).catch((error) => {
                console.error('Error:', error)
              })
          }, Math.floor(Math.random() * 100) * 1000)
        }).catch((error) => {
          console.error('Error:', error)
        })
    }, Math.floor(Math.random() * 100) * 1000)
  }).catch((error) => {
    console.error('Error:', error)
  }).catch((error) => {
    console.error('Error:', error)
  })
}

// uses retrieved data to generate additional stats
const generateStats = (tickerArray) => {
  const tickerArrayWStats = tickerArray.map(ticker => {
    // console.log('ticker', ticker)
    const historical = ticker.historical.reverse()
    const closePrices = historical.map(price => {
      return price.close
    })
    // console.log(util.inspect(closePrices, true, 10, true))
    ticker.ema8 = TI.EMA.calculate({ period: 8, values: closePrices })[0]
    ticker.ema20 = TI.EMA.calculate({ period: 20, values: closePrices })[0]
    ticker.ema50 = TI.EMA.calculate({ period: 50, values: closePrices })[0]
    ticker.ema200 = TI.EMA.calculate({ period: 200, values: closePrices })[0]

    ticker.wma8 = TI.WMA.calculate({ period: 8, values: closePrices })[0]
    ticker.wma20 = TI.WMA.calculate({ period: 20, values: closePrices })[0]
    ticker.wma50 = TI.WMA.calculate({ period: 50, values: closePrices })[0]
    ticker.wma200 = TI.WMA.calculate({ period: 200, values: closePrices })[0]

    ticker.rsi8 = TI.RSI.calculate({ period: 8, values: closePrices })[0]
    ticker.rsi20 = TI.RSI.calculate({ period: 20, values: closePrices })[0]
    ticker.rsi50 = TI.RSI.calculate({ period: 50, values: closePrices })[0]
    ticker.rsi200 = TI.RSI.calculate({ period: 200, values: closePrices })[0]

    const volumeInput = {
      open: [],
      high: [],
      low: [],
      close: [],
      volume: []
    }

    historical.forEach(candle => {
      volumeInput.open.push(candle.open)
      volumeInput.high.push(candle.high)
      volumeInput.low.push(candle.low)
      volumeInput.close.push(candle.close)
      volumeInput.volume.push(candle.volume)
    })

    ticker.VWAP = TI.VWAP.calculate(volumeInput)[0]

    volumeInput.period = 8
    ticker.atr8 = TI.ATR.calculate(volumeInput)[0]
    volumeInput.period = 20
    ticker.atr20 = TI.ATR.calculate(volumeInput)[0]
    volumeInput.period = 50
    ticker.atr50 = TI.ATR.calculate(volumeInput)[0]
    volumeInput.period = 200
    ticker.atr200 = TI.ATR.calculate(volumeInput)[0]

    return ticker
  })

  return tickerArrayWStats
}

// massages data for rendering
function renderStats (data) {
  // console.log(data)
  Object.entries(TICKER_LISTS).forEach(entry => {
    // account
    const key = entry[0]
    // list of tickers within account
    const list = entry[1]

    const p = new Table({
      title: key,
      style: {
        /*
            Style:
            ╔══════╦═════╦══════╗
            ║ hob  ║ foo ║ mia  ║
            ╟══════╬═════╬══════╢
            ║ ball ║ fox ║ mama ║
            ╚══════╩═════╩══════╝
            */
        headerTop: {
          left: '╔',
          mid: '╦',
          right: '╗',
          other: '═'
        },
        headerBottom: {
          left: '╟',
          mid: '╬',
          right: '╢',
          other: '═'
        },
        tableBottom: {
          left: '╚',
          mid: '╩',
          right: '╝',
          other: '═'
        },
        vertical: '║'
      }
    })
    list.forEach((ticker, index) => {
      // console.log(ticker)
      const dataItem = data.find(item => item.symbol === ticker)

      if (dataItem) {
        const printObj = {
          ticker: dataItem.symbol,
          price: dataItem.latestPrice
        }

        const fields = ['ema8', 'ema20', 'ema50', 'ema200', 'wma8', 'wma20', 'wma50', 'wma200', 'rsi8', 'rsi20', 'rsi50', 'rsi200']

        fields.forEach(field => {
          printObj[field] = `${Math.round((dataItem[field] + Number.EPSILON) * 100) / 100} ${dataItem.latestPrice > dataItem[field] ? '↑' : '↓'}`
        })

        p.addRow(printObj, { color: (index % 2 === 0) ? 'green' : 'yellow' })
      } else {
        // will error during unit tests because fixture data does not include all live tickers
        console.warn(`ticker error: ${ticker}`)
      }
    })

    p.printTable()
    console.log('\n')
  })
}

// main call for display
function renderDashboard () {
  const tickers = compileTickersToRetrieveData(TICKER_LISTS)
  // console.log(tickers)
  const historicalRequestArray = []
  tickers.forEach((ticker, index) => {
    historicalRequestArray.push(fetchQuoteAndHistory(ticker, index))
  })

  Promise.all(historicalRequestArray).then(function (responses) {
    // Get a JSON object from each of the responses
    return Promise.all(responses.map(function (response) {
      return response
    }))
  }).then(function (data) {
    // Log the data to the console
    // You would do something with both sets of data here

    const generatedData = generateStats(data)
    renderStats(generatedData)
    // console.log(util.inspect(data, true, 10, true))
  }).catch(function (error) {
    // if there's an error, log it
    console.log(error)
  })
}

module.exports = {
  compileTickersToRetrieveData,
  generateStats,
  renderDashboard
}
