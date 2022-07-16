import * as Yup from "yup"
import Products from "../models/Products"
import Categories from "../models/Categories"
import User from "../models/User"

class ProductsControler {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
        })

        try {
            await schema.validateSync(req.body, { abortEarly: false }) // esse tryCatch vai te ajudar muito na sua vida ainda
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { admins: isAdmin } = await User.findByPk(req.userId)
        //para validar se o usuario é admin
        if (!isAdmin) {
            return res.status(401).json({ error: "no permission" })
        }


        const { filename: path } = req.file
        const { name, price, category_id, offer } = req.body

        const prod = await Products.create({
            name,
            price,
            category_id,
            path,
            offer,
        })
        return res.json(prod)
    }

    async index(req, res) {
        const products = await Products.findAll({
            include: [
                {
                    model: Categories,
                    as: "category",
                    attributes: ["name", "id"],
                },
            ],
        })

        return res.json(products)
    }
    async update(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
        })

        try {
            await schema.validateSync(req.body, { abortEarly: false }) // esse tryCatch vai te ajudar muito na sua vida ainda
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { admins: isAdmin } = await User.findByPk(req.userId)
        //para validar se o usuario é admin
        if (!isAdmin) {
            return res.status(401).json({ error: "no permission" })
        }


        const { id } = req.params
        const update = await Products.findByPk(id)

        if (!update) {
            return res.status(400).json({ error: "Product not found" })
        }

        let path
        if (req.file) {
            path = req.file.filename
        }

        const { name, price, category_id, offer } = req.body

        const prod = await Products.update({
            name,
            price,
            category_id,
            path,
            offer,
        },
            { where: { id } }
        )
        return res.status(200).json({ message: "Products updated sucessfully" })
    }
}

export default new ProductsControler()
