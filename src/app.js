const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to server
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Home',
        name: 'Geomar'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Geomar'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Geomar',
        helpText: 'This is some helpful text'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) return res.send({
            error: 'You must provide an address'
        })

    const address = req.query.address
    geocode(address, (error, { latitude, longitude, placeName } = {}) => {
        if (error) return res.send({error})
    
        forecast(latitude,longitude, (error, {temperature, summary, precipProbability} = {}) => {
        
            if (error) return res.send({error})
    
            res.send({
                forecast: `It is currently ${temperature} degrees in ${placeName}. ${summary} There is ${precipProbability}% chance of rain.`,
                location: placeName,
                address: address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 - Page not found',
        errorMessage: "Help article not found!",
        name: 'Geomar'
    })

})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 - Page not found',
        errorMessage: "The page you are trying to reach does not exist.",
        name: 'Geomar'
    })
})

app.listen(port, () => {
    console.log(`Weather app server is up on port ${port}.`)
})