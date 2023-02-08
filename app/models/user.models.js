module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      username: {
        type: Sequelize.STRING
      },
      firstname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      birth_date: {
        type: Sequelize.DATE
      },
      register_date: {
        type: Sequelize.DATE
      },
      chat_color: {
        type: Sequelize.STRING
      },
      role_id: {
        type: Sequelize.INTEGER
      },
      telephone_number: {
        type: Sequelize.INTEGER
      },
      profile_image: {
        type: Sequelize.STRING
      }
    }, {
        timestamps: false
    })
  
    return User;
  }