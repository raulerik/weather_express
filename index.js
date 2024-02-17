const express = require('express')
const app = express()
const fetch = require('node-fetch')
const path = require('path')

app.set('view-engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.json())
app.use(express.urlencoded({extended:true}))

const key = '77fefff6fbdbd270c709438fbdfa6295'

const getWeatherDataPromise = (url) => {
    return new Promise((resolve, reject) => {
        fetch(url)
        .then(response => {
            return response.json()
        })
        .then(data => {
            let description = data.weather[0].description
            let city = data.name
            let temp = Math.round(parseFloat(data.main.temp)-273.15)
            let result = {
                description : description,
                city : city,
                temp : temp,
                error : null
            }
            resolve(result)
        })
        .catch(error => {
            reject(error)
        })
    })
}

app.all('/', (req,res) => {
    let city
    if(req.method == 'GET'){
        city = 'Tartu'
    }
    else if(req.method == 'POST'){
        city = req.body.cityname
    }
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`
    getWeatherDataPromise(url)
    .then(data => {
        res.render('default.ejs', data)
    })
    .catch(error => {
        res.render('default.ejs', {
            error: 'Problem with getting data, try again'
        })
    })
})
app.listen(3000)