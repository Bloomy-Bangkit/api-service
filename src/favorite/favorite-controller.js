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
        const { username, id } = req.query
        if (username) {
            const result = await favoriteService.getFavoriteByUsername(myUsername, username)
            res.status(200).json({ message: 'Get favorite by username buyer berhasil', data: result })
        } else if (id) {
            const result = await favoriteService.getFavoriteById(myUsername, id)
            res.status(200).json({ message: 'Get favorite by id berhasil', data: result })
        } else {
            throw new ResponseError(404, 'Query dibutuhkan')
        }
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
        const result = await favoriteService.postFavorite(myUsername, req.body.idProduct)
        res.status(200).json({ message: 'Post favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteFavorites = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await favoriteService.deleteFavorites(myUsername)
        res.status(200).json({ message: 'Delete favorites berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteFavorite = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idFavorite = req.params.id
        const result = await favoriteService.deleteFavorite(myUsername, idFavorite)
        res.status(200).json({ message: 'Delete favorite berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getFavorites,
    getFavorite,
    getMyFavorite,
    postFavorite,
    deleteFavorites,
    deleteFavorite
}