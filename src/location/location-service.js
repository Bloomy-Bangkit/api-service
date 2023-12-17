const ResponseError = require('../error/response-error.js')
const dataLocation = require('./location-data.js')

const getProvinsi = async() => {
    const provinsi = dataLocation.map(data => data.provinsi)
    if (provinsi.length === 0) throw new ResponseError(404, 'Data provinsi tidak tersedia')
    return provinsi
}

const getKota = async namaProvinsi => {
    const result = dataLocation.find(location => location.provinsi === namaProvinsi.toUpperCase())
    if (!result) throw new ResponseError(404, 'Data provinsi tidak tersedia')
    if (!result.kota) throw new ResponseError(404, 'Data kota tidak tersedia')
    return { provinsi: namaProvinsi.toUpperCase(), kota: result.kota }
}

module.exports = {
    getProvinsi,
    getKota
}