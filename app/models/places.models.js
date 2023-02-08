module.exports = (sequelize, Sequelize) => {
    const Place = sequelize.define("places", {
      place_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      image_name: {
        type: Sequelize.STRING
      },
      region_id: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.DECIMAL
      },
      date: {
        type: Sequelize.DATE
      }
    }, {
        timestamps: false
    })
  
    return Place;
  }