const config = require('../config.json')
const printLog = require('./printLog')

const filterQueryResults = results => {
  var filteredResults = []
  const lastUpdate = new Date(config.lastUpdate)
  const regex = /(grand mare|vallon suisse|Mont Saint-Aignan|haut(eur)*(s)* (de )*rouen)/gi

  results.forEach(result => {
    const desc = result.description
    const date = new Date(result.date)

    // If regex doesn't match and date superior to last update
    if (!desc.match(regex) && date > lastUpdate) {
      filteredResults.push(result)
    }
  })
  printLog('Nb real result = ' + filteredResults.length)
  return filteredResults
}

module.exports = filterQueryResults
