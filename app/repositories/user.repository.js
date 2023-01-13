module.exports.findUserByUsername = async (db, username) => {
    return await db.user.findAll({
        where: {
            username: [username]
        }
    })
}

module.exports.findMaxId = async (db) => {
    return await db.user.max('user_id')
}

module.exports.saveUser = async (user) => {
    return user.save()
}