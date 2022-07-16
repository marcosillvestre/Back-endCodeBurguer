import * as Yup from 'yup'
import Categories from '../models/Categories'
import User from '../models/User'

class CategoriesControler {
    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        })

        try {
            await schema.validateSync(req.body, { abortEarly: false })                 //esse tryCatch vai te ajudar muito na sua vida ainda 
        } catch (err) {
            return res.status(400).json({ error: err.errors })
        }

        const { admins: isAdmin } = await User.findByPk(req.userId)

        if (!isAdmin) {
            return res.status(401).json({ error: "no permission" })
        }


        const { name } = req.body
        const { filename: path } = req.file

        const categoriesExists = await Categories.findOne({ where: { name, } })

        if (categoriesExists) {
            return res.status(400).json({ error: "Category already exists" })
        }


        const { id } = await Categories.create({ name, path })

        return res.json({ id, name })

    }

    async index(req, res) {

        const categ = await Categories.findAll()
        return res.status(201).json(categ)
    }

    //

    async update(req, res) {
        try {

            const schema = Yup.object().shape({
                name: Yup.string(),
            })

            try {
                await schema.validateSync(req.body, { abortEarly: false })                 //esse tryCatch vai te ajudar muito na sua vida ainda 
            } catch (err) {
                return res.status(400).json({ error: err.errors })
            }

            const { admins: isAdmin } = await User.findByPk(req.userId)

            if (!isAdmin) {
                return res.status(401).json({ error: "no permission" })
            }

            const { name } = req.body

            const { id } = req.params


            const category = await Categories.findByPk(id)
            if (!category) {
                return res.status(401).json({ error: "Category not found" })
            }


            let path
            if (req.file) {
                path = req.file.filename
            }


            await Categories.update({ name, path }, { where: { id } })

            return res.status(200).json({ message: 'category updated sucessfully' })

        } catch (err) {
            console.log(err)
        }
    }


}

export default new CategoriesControler()