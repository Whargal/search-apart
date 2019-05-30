const fs = require('fs')
const leboncoin = require('leboncoin-api')
const mjml2html = require('mjml')
const sgMail = require('@sendgrid/mail')

var config = require('./config.json')

var promises = []
const lastUpdate = new Date(config.lastUpdate)
const runDate = new Date()
var stream_write = fs.createWriteStream(`${config.home}debug.log`, { flags: 'a' })

sgMail.setApiKey(config.sendGridToken)

const printLog = (text, callback = () => {}, now = false) => {
  if (now) {
    stream_write.write(`${runDate.toISOString()} ${text} \n`, callback)
  } else {
    promises.push(stream_write.write(`${runDate.toISOString()} ${text} \n`), callback)
  }
}

// Prepare Leboncoin query
var search = new leboncoin.Search()
  .setPage(1)
  .setLimit(999)
  .setSort({
    sort_by: 'date',
    sort_order: 'asc',
  })
  .setFilter(leboncoin.FILTERS.ALL)
  .setCategory('ventes_immobilieres')
  .setRegion('haute_normandie')
  .setDepartment('seine_maritime')
  .setLocation([{ zipcode: '76000' }, { zipcode: '76100' }])
  .addSearchExtra('price', { min: 0, max: 125000 })
  .addSearchExtra('rooms', { min: 4 })

// Execute Leboncoin research
search.run().then(data => {
  printLog('nb result = ' + data.nbResult)

  var wantedResults = 0
  var renderEmails = ''
  const regex = /(grand mare|vallon suisse|Mont Saint-Aignan|haut(eur)*(s)* (de )*rouen)/gi

  data.results.forEach(el => {
    const desc = el.description
    const date = new Date(el.date)

    // If regex doesn't match and date superior to last update
    if (!desc.match(regex) && date > lastUpdate) {
      promises.push(sendEmailSendGrid(el))

      renderEmails += emailMjml(el).html
      wantedResults++
    }
  })
  printLog('nb real result = ' + wantedResults)

  // Execute all promises
  Promise.all(promises)
    .then(() => {
      printLog(
        'All email sent',
        () => {
          process.exit()
        },
        true,
      )
    })
    .catch(error => {
      printLog(
        error,
        () => {
          process.exit()
        },
        true,
      )
    })

  render(renderEmails)

  ////    Update the date    ////
  config.lastUpdate = runDate
  fs.writeFile(`${config.home}config.json`, JSON.stringify(config), 'utf8', () => {})
})

////    FUNC SEND FAKE EMAIL    ////
const sendFakeEmail = el => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, Math.floor(Math.random() * 1000))
  }).then(() => {
    printLog('Resolving ' + el.title)
  })
}

////    FUNC RENDER    ////
const render = renderEmails => {
  const express = require('express')

  var app = express()

  app.get('/', function(req, res) {
    res.render('index.ejs', { emails: renderEmails })
  })

  app.listen(8080)
}

////    FUNC SEND EMAIL SENDGRID    ////
const sendEmailSendGrid = el => {
  const msg = {
    to: config.emailTo,
    from: config.emailFrom,
    subject: el.title,
    html: emailMjml(el).html,
  }
  return sgMail
    .send(msg)
    .then(() => {
      printLog('Email sent: ' + el.title)
    })
    .catch(error => {
      printLog('Error email: ' + el.title)
      printLog(error)
    })
}

////    FUNC EMAIL MJML TO HTML    ////
const emailMjml = el =>
  mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
              <mj-image src="${el.images[0]}"></mj-image>

              <mj-text color="#212b35" font-weight="bold" font-size="20px">
                ${el.title}
              </mj-text>
              <mj-text color="#637381" font-size="16px" font-style="italic">
                ${el.date}
              </mj-text>
              <mj-text color="#637381" font-size="16px">
                ${el.description}
              </mj-text>
            
              <mj-text font-size="16px">
                <a href="${el.link}" target="_blank">${el.link}</a>
              </mj-text>
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `)
