const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

//mail contains
const bodyParser=require('body-parser');
//const exphbs= require ('express-handlebars');
const nodemailer=require ('nodemailer');


const app = express()
const port = process.env.PORT || 3000
// it will make an enviornmental variable . It will available on heroku. If it fail we will provide the default value of port 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.use(bodyParser.urlencoded({extended:false})); // for email

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Ujjwal Akash'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Ujjwal Akash'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        layout: false,
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Ujjwal Akash'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Andrew Mead',
        errorMessage: 'Page not found.'
    })
})


app.post('/send',(req,res) => {
    
    const output =
    `<p> New help message with following details : </p>
    <ul>
        <li>Email : ${req.body.email}</li>
        <li>Message : ${req.body.message}</li>
            <li>Mobile no : ${req.body.mobile}</li>
                </ul>
                `
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    
                  
                    auth: {
                      user: 'ujjwalakash147@gmail.com',
                      pass: 'Ujjwal@123'
                    },
                    tls:{
                        rejectUnauthorized:false
                    }
                  });
                  //transporter will tell which client we will use to send a mail
                  var mailOptions = {
                    from: req.body.email,
                    to: 'ujjwalakash147@gmail.com',
                    subject: 'Sending Email using Node.js',
                    text: 'That was easy!',
                    html: output// output
                  };
                  // mail option is an object
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                   
                    }
                   
                  
                   //res.render('contact',{layout: false,msg:`Email has senr`});
                  });
    
})

app.listen(port, () => {
    console.log('Server is up on port' +port)
})