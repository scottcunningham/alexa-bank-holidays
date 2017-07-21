const request = require('request')
const isFuture = require('date-fns/is_future')
const format = require('date-fns/format')

const URL = 'https://www.gov.uk/bank-holidays.json'

const makeRequest = () => {
  return new Promise((fulfill, reject) => {
    request(URL, (err, res, body) => {
      if (err || res.statusCode !== 200) {
        reject(err)
      }
      else {
        try {
          fulfill(JSON.parse(body))
        } catch(ex) {
          reject(ex)
        }
      }
    })
  })
}

const processResults = (results) => {
  let events = results['england-and-wales'].events

  // Cut out ones in the past.
  events = events.filter(event => isFuture(event.date))

  // We'll only return the first entry.
  // Add the date in a nice format to it.
  let nextHoliday = events[0]
  nextHoliday.formattedDate = format(nextHoliday.date, 'dddd Do MMMM YYYY')
  return nextHoliday

}

const getNextBankHoliday = () => {
  return new Promise((fulfill, reject) => {
    makeRequest().then(
      (results) => fulfill(processResults(results)),
      reject
    )
  })
}

exports.getNextBankHoliday = getNextBankHoliday
