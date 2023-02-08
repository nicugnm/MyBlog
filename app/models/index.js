const dbConfig = require("../../config/db.config.js")

const Sequelize = require("sequelize")
const sequelize = new Sequelize(dbConfig.sequelize.DB, dbConfig.sequelize.USER, dbConfig.sequelize.PASSWORD, {
  host: dbConfig.sequelize.HOST,
  dialect: dbConfig.sequelize.dialect,
  dialectOptions: {
    ssl: true
  },
  operatorsAliases: false,

  pool: {
    max: dbConfig.sequelize.pool.max,
    min: dbConfig.sequelize.pool.min,
    acquire: dbConfig.sequelize.pool.acquire,
    idle: dbConfig.sequelize.pool.idle
  }
})
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.user = require("./user.models.js")(sequelize, Sequelize)
db.place = require("./places.models.js")(sequelize, Sequelize)
db.region = require("./regions.models.js")(sequelize, Sequelize)

db.place.hasOne(db.region, {
  sourceKey: 'region_id',
  foreignKey: 'region_id'
}) // place - region - one to one

module.exports = db