const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/9ff9f04ef903c9fbab9467ff17b2e0fd/' + latitude + ',' + longitude
   
    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            
            var f=body.currently.temperature;
            var c=(f-32)*5/9;
            var celsius=c.toFixed(2);
            callback(undefined, body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + '° F or '+ celsius + '° C out. This high today is ' +body.daily.data[0].temperatureHigh + '° F with a low of '+ body.daily.data[0].temperatureLow +'° F. There is a ' + body.currently.precipProbability + '% chance of rain.')
        }
    })
}

module.exports = forecast