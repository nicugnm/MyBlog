const repositories = {}

repositories.users = require("./user.repository.js")
repositories.invoices = require("./invoices.repository.js")
repositories.places = require("./place.repository.js")

module.exports = repositories