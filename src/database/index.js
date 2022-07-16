import Sequelize from "sequelize"
import dbconfig from "../config/database"
import user from "../app/models/User"
import products from "../app/models/Products"
import Categories from "../app/models/Categories"

import mongoose from "mongoose"

const models = [user, products, Categories]

class Database {
    constructor() {
        this.init()
        this.mongo()
    }

    init() {
        this.connection = new Sequelize(dbconfig)
        models
            .map((model) => model.init(this.connection))
            .map((model) => model.associate && model.associate(this.connection.models))
    }
    mongo() {
        this.mongoConnection = mongoose.connect('mongodb://localhost:27017/codeBurguer',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
    }
}

export default new Database()
