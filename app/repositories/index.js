const repositories = {}

const id = (id) => id

repositories.users = require("./user.repository.js");

module.exports = repositories;