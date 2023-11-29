const path = require('path')
const favoriteService = require('./favorite-service.js')
const ResponseError = require('../error/response-error.js')

const getFavorites = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await favoriteService.getFavorites(myUsername)
        res.status(200).json({ message: 'Get favorites berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getFavorite = async(req, res, next) => {
    try {
        const myUsername = req.username
        const usernameBuyer = req.query.username
        const result = await favoriteService.getFavorite(myUsername, usernameBuyer)
        res.status(200).json({ message: 'Get favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getMyFavorite = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await favoriteService.getMyFavorite(myUsername)
        res.status(200).json({ message: 'Get my favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const postFavorite = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await favoriteService.postFavorite(myUsername)
        res.status(200).json({ message: 'Post favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteFavorite = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await favoriteService.deleteFavorite(myUsername)
        res.status(200).json({ message: 'Put favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getFavorites,
    getFavorite,
    getMyFavorite,
    postFavorite,
    deleteFavorite
}