const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/f11ff3c83f7f8537f5cb99ec948024ff/' + latitude + ',' + longitude + '?units=si'
    request({url, json: true}, (error, { body }) => {
        if (error) return callback('Unable to connect to weather service!', undefined)
        
        if (body.error) return callback('Unable to find location!', undefined)

        callback(undefined, {
            summary: body.daily.data[0].summary,
            temperature: body.currently.temperature,
            precipProbability: body.currently.precipProbability,
            result: `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`

        })
    })
}

module.exports = forecast