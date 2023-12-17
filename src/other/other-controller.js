const axios = require('axios')
const ResponseError = require('../error/response-error.js')
const WEATHER_API_KEY = require('./other-data.js')
const validate = require('../middleware/validation.js')
const otherValidation = require('./other-validation.js')

const getCuaca = async(req, res, next) => {
    try {
        const validRequest = validate(otherValidation.cuacaValidation, req.body)
        const { lat, long } = validRequest
        let result
        for (let i = 0; i < WEATHER_API_KEY.length; i++) {
            result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${WEATHER_API_KEY[i]}`)
            if (result) break
        }
        const { data } = result
        if (!result) throw new ResponseError(400, 'Gagal mendapatkan data weather')
        return res.status(200).json({
            error: false,
            message: 'Berhasil get data cuaca',
            data: {
                latitude: data.coord.lat,
                longitude: data.coord.lon,
                outlook: data.weather[0].main,
                temperature: data.main.temp - 273.15,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
            }
        })
    } catch (error) {
        next(error)
    }
}

const getGempa = async(req, res, next) => {
    try {
        const result = await axios.get('https://cuaca-gempa-rest-api.vercel.app/quake')
        const { data } = result.data
        const coordinates = data.coordinates.split(',')
        const lat = coordinates[0]
        const long = coordinates[1]
        return res.status(200).json({
            error: false,
            message: 'Berhasil get data gempa',
            data: {
                ...data,
                lat: parseFloat(lat),
                long: parseFloat(long)
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCuaca,
    getGempa
}