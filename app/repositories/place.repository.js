module.exports.findPlacesWithRegion = async (db) => {
    return await db.place.findAll({
        include: {
            model: db.region,
            required: true
        }
    })
}