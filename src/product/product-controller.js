const path = require('path')
const productService = require('./product-service.js')
const ResponseError = require('../error/response-error.js')

const getProducts = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await productService.getProducts(myUsername)
        res.status(200).json({ message: 'Get products berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const getProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const { username, id, nama, grade } = req.query
        if (username) {
            const result = await productService.getProductByUsername(myUsername, username)
            res.status(200).json({ message: 'Get product by username berhasil', data: result })
        } else if (id) {
            const result = await productService.getProductById(myUsername, id)
            res.status(200).json({ message: 'Get product by id berhasil', data: result })
        } else if (nama) {
            const result = await productService.getProductByName(myUsername, nama)
            res.status(200).json({ message: 'Get product by name berhasil', data: result })
        } else if (grade) {
            const result = await productService.getProductByGrade(myUsername, grade)
            res.status(200).json({ message: 'Get product by grade berhasil', data: result })
        } else {
            throw new ResponseError(400, 'Query dibutuhkan')
        }
    } catch (error) {
        next(error)
    }
}

const getMyProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await productService.getMyProduct(myUsername)
        res.status(200).json({ message: 'Get my product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const postProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const file = req.file
        if (!file) throw new ResponseError(400, 'Tidak ada foto yang diunggah')
        const filename = file.filename
        const filePath = path.join(__dirname, '../../uploads', filename)
        const result = await productService.postProduct(myUsername, filePath, req.body)
        res.status(200).json({ message: 'Post product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updateProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idProduct = req.query.id
        const result = await productService.updateProduct(myUsername, idProduct, req.body)
        res.status(200).json({ message: 'Put product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const updatePhotoProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await productService.updatePhotoProduct(myUsername)
        res.status(200).json({ message: 'Put product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteProducts = async(req, res, next) => {
    try {
        const myUsername = req.username
        const result = await productService.deleteProducts(myUsername)
        res.status(200).json({ message: 'Delete product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async(req, res, next) => {
    try {
        const myUsername = req.username
        const idProduct = req.params.id
        const result = await productService.deleteProduct(myUsername, idProduct)
        res.status(200).json({ message: 'Delete product berhasil', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProducts,
    getProduct,
    getMyProduct,
    postProduct,
    updateProduct,
    updatePhotoProduct,
    deleteProducts,
    deleteProduct
}