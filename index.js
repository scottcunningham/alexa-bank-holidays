const Alexa = require('alexa-sdk')
const {appId} = require('./config.json')
const {getNextBankHoliday} = require('./holidays.js')

const helpMessage = `Say 'when is the next bank holiday' to find out when the next bank holiday in England and Wales is.`

const handlers = {
  "BankHolidayIntent"() {
    getNextBankHoliday().then(
      (holiday) => {
        const msg = `The next bank holiday in England and Wales is ${holiday.title} on ${holiday.formattedDate}. Enjoy!`
      },
      (err) => {
        this.emit(':tell', `Something went wrong. Sorry about that.`)
      }
    )
  }
  "AboutIntent"() {
    this.emit(':tell', 'UK Bank Holidays tells you when the next bank holiday is in England and Wales.')
  },
  "AMAZON.HelpIntent"() {
    this.emit(':ask', helpMessage, helpMessage);
  },
  "AMAZON.StopIntent"() {
    this.emit(':tell', 'Goodbye.')
  },
  "AMAZON.CancelIntent"() {
    this.emit(':tell', 'Goodbye.')
  },
  "AMAZON.LaunchRequest"() {
    this.emit(':ask', helpMessage, helpMessage)
  },
  "Unhandled"() {
    this.emit(':ask', helpMessage, helpMessage);
  },
}

exports.handler = (event, context) => {
  const alexa = Alexa.handler(event, context)
  alexa.appId = appId
  alexa.registerHandler(handlers)
  alexa.execute()
}
