////    REQUIRE MODULES    ////
// Node
const fs = require('fs')
// Config
const config = require('./config.json')
// Helpers
const printLog = require('./helpers/printLog')
const filterQueryResults = require('./helpers/filterQueryResults')
// Queries
const queryLeboncoin = require('./queries/leboncoin')
// Actions
const sendFakeEmail = require('./actions/sendFakeEmail')
const sendEmailSendgrid = require('./actions/sendEmailSendgrid')
// Server
const render = require('./server/render')

////    INIT    ////
// Set NODE_ENV if undefined
process.env.NODE_ENV = process.env.NODE_ENV != undefined ? process.env.NODE_ENV : 'production'
// Date when code start execute
const runDate = new Date()

////    START APP    ////
queryLeboncoin()
  .then(data => {
    // Get results from query & filter the ones we want
    printLog('nb result = ' + data.nbResult)
    return filterQueryResults(data.results)
  })
  .then(filteredResults => {
    // Trigger actions according to NODE_ENV
    switch (process.env.NODE_ENV) {
      case 'development':
        return Promise.all(
          filteredResults.map(result => {
            return sendFakeEmail(result)
          }),
        )
        break

      case 'render':
        render(filteredResults)

      default:
        return Promise.all(
          filteredResults.map(result => {
            return sendEmailSendgrid(result)
          }),
        )
        break
    }
  })
  .then(() => {
    printLog('All email sent !')
    ////    Update the date    ////
    config.lastUpdate = runDate
    fs.writeFile(`${config.home}config.json`, JSON.stringify(config, null, 2), 'utf8', () => {})
  })
