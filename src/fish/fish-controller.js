const fishService = require('./fish-service')

const getFishs = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await fishService.getFishs(myUsername)
        res.status(200).json({ error: false, message: 'Berhasil get fishs', data: result })
    } catch (error) {
        next(error)
    }
}

const getFishId = async(req, res, next) => {
    try {
        const myUsername = req.username
        const id = req.params.id
        const result = await fishService.getFishId(myUsername, id)
        res.status(200).json({ error: false, message: 'Berhasil get fishs by id', data: result })
    } catch (error) {
        next(error)
    }
}

const postFish = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await fishService.postFish(myUsername, req.body)
        res.status(200).json({ error: false, message: 'Berhasil post fish', data: result })
    } catch (error) {
        next(error)
    }
}

const putFish = async(req, res, next) => {
    try {
        const myUsername = req.username
        const id = req.params.id
        const result = await fishService.putFish(myUsername, id, req.body)
        res.status(200).json({ error: false, message: 'Berhasil update fish', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteFish = async(req, res, next) => {
    try {
        const myUsername = req.username
        const id = req.params.id
        const result = await fishService.deleteFish(myUsername, id)
        res.status(200).json({ error: false, message: 'Berhasil delete fish', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getFishs,
    getFishId,
    postFish,
    putFish,
    deleteFish
}