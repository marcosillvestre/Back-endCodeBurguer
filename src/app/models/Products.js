import Sequelize, { Model } from 'sequelize';

class Products extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                price: Sequelize.STRING,
                path: Sequelize.STRING,
                offer: Sequelize.BOOLEAN,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `http://localhost:3000/product-file/${this.path}`
                    },
                },
            },
            {
                sequelize,
            }
        )
        return this
    }
    static associate(models) {
        this.belongsTo(models.Categories, { foreignKey: 'category_id', as: 'category', })
    }   //associando uma tabela a outra {'foreignKey se deve pelo campo que a migration criou'}
}

export default Products