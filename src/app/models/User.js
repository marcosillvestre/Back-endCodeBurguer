import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcrypt';

class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                admins: Sequelize.BOOLEAN,
            },
            {
                sequelize,
            }
        )

        this.addHook('beforeSave', async (users) => {
            if (users.password) {
                users.password_hash = await bcrypt.hash(users.password, 10)
            }
        })                   //criptografia de senha
        return this
    }

    checkPassword(password) {
        return bcrypt.compare(password, this.password_hash)
    }
}

export default User