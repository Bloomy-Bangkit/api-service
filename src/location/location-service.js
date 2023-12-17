const ResponseError = require('../error/response-error.js')
const dataLocation = require('./location-data.js')

const getProvinsi = async() => {
    const provinsi = dataLocation.map(data => {
        let namaCapitalized = data.provinsi.toLowerCase().split(' ')
        for (let i = 0; i < namaCapitalized.length; i++) {
            namaCapitalized[i] = namaCapitalized[i].replace(/^./, namaCapitalized[i][0].toUpperCase())
        }
        namaCapitalized = namaCapitalized.join(' ')
        return { id: data.id, nama: namaCapitalized }
    })
    if (provinsi.length === 0) throw new ResponseError(404, 'Data provinsi tidak tersedia')

    return provinsi
}

const getKota = async id => {
    const result = dataLocation.find(location => location.id == id)
    if (!result) throw new ResponseError(404, 'Data provinsi tidak tersedia')
    if (!result.kota_kabupaten) throw new ResponseError(404, 'Data kota tidak tersedia')
    const kotaKabupaten = result.kota_kabupaten
    const newKotaKabupaten = kotaKabupaten.map((kotaKab, index) => {
        let namaCapitalized = kotaKab.toLowerCase().split(' ')
        for (let i = 0; i < namaCapitalized.length; i++) {
            namaCapitalized[i] = namaCapitalized[i].replace(/^./, namaCapitalized[i][0].toUpperCase())
        }
        namaCapitalized = namaCapitalized.join(' ')
        if (index < 10) return {
            id: parseInt(`${id}0${index}`),
            id_provinsi: parseInt(id),
            nama: namaCapitalized,
        }
        return {
            id: parseInt(`${id}${index}`),
            id_provinsi: parseInt(id),
            nama: namaCapitalized,
        }
    })
    return newKotaKabupaten
}

module.exports = {
    getProvinsi,
    getKota
}