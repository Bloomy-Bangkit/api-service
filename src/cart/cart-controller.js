const cartService = require('./cart-service.js')

const getCarts = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await cartService.getCarts(myUsername)
        res.status(200).json({ message: 'Get carts berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const postCart = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await cartService.postCart(myUsername, req.body)
        res.status(200).json({ message: 'Post cart berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteCart = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await cartService.deleteCart(myUsername, req.body)
        res.status(200).json({ message: 'Delete cart berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getCarts,
    postCart,
    deleteCart
}