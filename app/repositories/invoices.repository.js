const CosmosClient = require("@azure/cosmos").CosmosClient;
const dbConfig = require('../../config/db.config.js')

const client = new CosmosClient({ endpoint: dbConfig.cosmosDb.endpoint, key: dbConfig.cosmosDb.key });

const createDbAndContainerOrGet = async () => {
    const { database } = await client.databases.createIfNotExists({
        id: dbConfig.cosmosDb.databaseId
    })

    const { container } = await database.containers.createIfNotExists({
        id: dbConfig.cosmosDb.containerId
    })

    return container
}

module.exports.saveInvoice = async (id, name, content) => {
    const container = await createDbAndContainerOrGet()

    return await container.items.create({
        id: id,
        name: name,
        content: content
    })
}

module.exports.getInvoiceById = async (id) => {
    const container = await createDbAndContainerOrGet()

    return await container.item(id).read()
}

module.exports.getInvoiceByName = async (name) => {
    const container = await createDbAndContainerOrGet()

    return await container.item(name).read()
}

module.exports.updateInvoice = async (id, name, content) => {
    const container = await createDbAndContainerOrGet()

    return await container.item(id).replace({
        id: id,
        name: name,
        content: content
    })
}

module.exports.deleteInvoice = async (id) => {
    const container = await createDbAndContainerOrGet()

    return await container.item(id).delete()
}