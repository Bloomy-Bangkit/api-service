const modelSync = async(force, model) => {
    for (let i = 0; i < model.length; i++) {
        await model[i]
            .sync({ force })
            .then(() => console.log('Models synchronized with the Database!'))
            .catch(error => console.error(`ERROR synchronizing Models, message: ${error}`))
    }
}

module.exports = modelSync