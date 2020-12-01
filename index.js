const { Command } = require('commander')
const program = new Command()
program.version('0.0.1')

const iex = require('./lib/iex')

program
  .option('-d, --debug', 'output extra debugging')
  .option('-i, --iex', 'render dashboard')

program.parse(process.argv)

if (program.debug) console.log(program.opts())

if (program.iex) {
  iex.renderDashboard()
}
