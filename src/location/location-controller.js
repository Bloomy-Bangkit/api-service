const locationService = require('./location-service.js')

const getProvinsi = async(req, res, next) => {
    try {
        const result = await locationService.getProvinsi()
        return res.status(200).json({ message: 'Berhasil get data provinsi', data: result })
    } catch (error) {
        next(error)
    }
}

const getKota = async(req, res, next) => {
    try {
        const namaProvinsi = req.params.nama
        const result = await locationService.getKota(namaProvinsi)
        return res.status(200).json({ message: 'Berhasil get data kota', data: result })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getProvinsi,
    getKota
}