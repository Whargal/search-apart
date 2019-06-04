const sgMail = require('@sendgrid/mail')

const printLog = require('../helpers/printLog')
const emailMjml = require('../helpers/emailMjml')

const config = require('../config.json')

sgMail.setApiKey(config.sendGridToken)

////    FUNC SEND EMAIL SENDGRID    ////
const sendEmailSendgrid = el => {
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

module.exports = sendEmailSendgrid
