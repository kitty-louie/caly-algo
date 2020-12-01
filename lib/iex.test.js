const iex = require('./iex')
const fixture = require('./iex.fixture')

const { Table } = require('console-table-printer')

test('compileTickersToRetrieveData', () => {
  const results = iex.compileTickersToRetrieveData(fixture.TICKERS)
  const expected = ['AAAU', 'AAPL', 'ABBV', 'AMZN', 'TSLA', 'AAPL', 'BLNK']

  expect(results).toEqual(expect.arrayContaining(expected))
})

test('generateStats', () => {
  const results = iex.compileTickersToRetrieveData(fixture.GENERATED_DATA)

  expect(results[0]).toMatchObject({
    ema8: expect.any(Number),
    ema20: expect.any(Number),
    // ema50: expect.any(Number),
    // ema200: expect.any(Number),
    wma8: expect.any(Number),
    wma20: expect.any(Number),
    // wma50: expect.any(Number),
    // wma200: expect.any(Number),
    rsi8: expect.any(Number),
    rsi20: expect.any(Number)
    // rsi50: expect.any(Number),
    // rsi200: expect.any(Number)
  })
})