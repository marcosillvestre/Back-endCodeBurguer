import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/authentication'

class SessionControler {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        // const validationEmailPassword = () => {
        //     return res.status(401).json({ error: "make sure your informations are correct you dambass bastard" })
        // }   economizar linhas :: olhar depois


        if (!(await schema.isValid(req.body))) {
            return res.status(401).json({ error: "make sure your informations are correct you dambass bastard , you miss something" })

        }
        const { email, password } = req.body

        const user = await User.findOne({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({ error: "make sure your informations are correct you dambass bastard  you forgot you email ? are you what ???? an idiot ? " })

        }


        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: " you fucking stupid man ??? ya don't know you own password ??" })
        };

        // console.log ( await user.checkPassword(password))


        return res.json({
            id: user.id,
            name: user.name,
            email,
            admins: user.admins,
            token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
                expiresIn: authConfig.expiresIn,
            })
        })
    }
}
export default new SessionControler()