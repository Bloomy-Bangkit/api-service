const productService = require('./product-service.js')

const getProducts = async(req, res, next) => {
    try {
        const email = req.email
        const result = await productService.getProducts(email)
        res.status(200).json({ message: 'Get products berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getProduct = async(req, res, next) => {
    try {
        const email = req.email
        const { username, id } = req.query
        if (username) {
            const result = await productService.getProduct(email)
            res.status(200).json({ message: 'Get product by username berhasil', data: result, username })
        } else if (id) {
            const result = await productService.getProduct(email)
            res.status(200).json({ message: 'Get product by id berhasil', data: result, id })
        } else {
            const result = await productService.getProduct(email)
            res.status(200).json({ message: 'Get product berhasil', data: result })
        }
    } catch (error) {
        next(error)
    }
}

const getMyProduct = async(req, res, next) => {
    try {
        const email = req.email
        const result = await productService.getMyProduct(email)
        res.status(200).json({ message: 'Get my product berhasil', data: result, email })
    } catch (error) {
        next(error)
    }
}

const postProduct = async(req, res, next) => {
    try {
        const email = req.email
        const result = await productService.postProduct(email)
        res.status(200).json({ message: 'Post product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const putProduct = async(req, res, next) => {
    try {
        const email = req.email
        const idProduct = req.params.id
        const result = await productService.putProduct(email, idProduct)
        res.status(200).json({ message: 'Put product berhasil', data: result, idProduct })
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async(req, res, next) => {
    try {
        const email = req.email
        const idProduct = req.params.id
        const result = await productService.deleteProduct(email, idProduct)
        res.status(200).json({ message: 'Delete product berhasil', data: result, idProduct })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    getMyProduct,
    postProduct,
    putProduct,
    deleteProduct
}