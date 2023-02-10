module.exports = (sequelize, Sequelize) => {
    const Region = sequelize.define("regions", {
      region_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      region_name: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false
    })
  
    return Region;
  }