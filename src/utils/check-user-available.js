const validate = require('../middleware/validation.js')
const ResponseError = require('../error/response-error.js')
const userValidation = require('../user/user-validation.js')
const User = require('../user/user-model.js')

const checkUserAvaiable = async(isRetrun, myUsername) => {
    const validMyUsername = validate(userValidation.usernameValidation, myUsername)
    const searchUser = await User.findOne({ where: { username: validMyUsername } })
    if (!searchUser) throw new ResponseError(404, 'User tidak tersedia')
    if (isRetrun) return searchUser
}

module.exports = checkUserAvaiable