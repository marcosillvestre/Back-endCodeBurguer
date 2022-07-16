import jwt from 'jsonwebtoken'
import authConfig from '../../config/authentication'

export default (req, res, next) => {
    const authToken = req.headers.authorization


    if (!authToken) {
        return res.status(401).json({ error: 'token not provided' })
    }

    const token = authToken.split(" ")[1]

    try {
        jwt.verify(token, authConfig.secret, function (error, decoded) {
            if (error) {
                throw new Error()
            }

            req.userId = decoded.id
            req.userName = decoded.name

            return next()
        })
    } catch (error) {
        return res.status(401).json({ error: "token invallid" })
    }


}