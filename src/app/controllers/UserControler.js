import { v4 } from "uuid"
import User from "../models/User"
import * as Yup from "yup"

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admins: Yup.boolean(),
    })

    // if (!(await schema.isValid(req.body))) { {{{outra maneira de validar os campos}}}
    //   return res.status(400).json({ error: " make sure your data is valid" })
    // }
    try {
      await schema.validateSync(req.body, { abortEarly: false }) // esse tryCatch vai te ajudar muito na sua vida ainda
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const { name, email, password, admins } = req.body

    const userExists = await User.findOne({
      where: { email },
    })

    if (userExists) {
      return res.status(400).json({ error: "This user already exists" })
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admins,
    })
    return res.status(201).json({ id: user.id, name, email, admins })
  }
}
export default new UserController()
