const fs = require('fs')

var config = require('../config.json')

var stream_write = fs.createWriteStream(`${config.home}debug.log`, { flags: 'a' })
const runDate = new Date()

const printLog = text => {
  return new Promise(resolve => {
    if (process.env.NODE_ENV === 'production') {
      stream_write.write(`${runDate.toISOString()} ${text} \n`)
    } else {
      console.log(text)
      resolve()
    }
  })
}

module.exports = printLog
