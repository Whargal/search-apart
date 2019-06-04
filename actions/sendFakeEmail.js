const printLog = require('../helpers/printLog')

////    FUNC SEND FAKE EMAIL    ////
const sendFakeEmail = el => {
  return new Promise(resolve => {
    setTimeout(resolve, Math.floor(Math.random() * 1000))
  }).then(() => {
    printLog(`Fake email sent: ${el.title}`)
  })
}

module.exports = sendFakeEmail
