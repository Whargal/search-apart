const express = require('express')

const emailMjml = require('../helpers/emailMjml')

////    CREATE EXPRESS RENDER SERVER    ////
const render = results => {
  let renderEmails

  results.forEach(result => {
    renderEmails += emailMjml(result).html
  })

  var app = express()

  app.get('/', function(req, res) {
    res.render('index.ejs', { emails: renderEmails })
  })

  app.listen(8080)
  console.log('Server ready at: http://localhost:8080')
}

module.exports = render
