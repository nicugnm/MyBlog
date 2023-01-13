module.exports.findUserById = async (db, id) => {
    return await db.user.findAll({
        where: {
            user_id: [id]
        }
    })
}