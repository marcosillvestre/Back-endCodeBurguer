import * as Yup from "yup"
import Products from "../models/Products"
import Category from "../models/Categories"
import Order from "../schemas/Order"
import User from "../models/User"

class OrderController {
  async store(req, res) {
    const schema = Yup.object().shape({

      products: Yup.array().required().of(

        Yup.object().shape({

          id: Yup.number().required(),
          quantity: Yup.number().required(),
        })
      )
    })
    try {
      await schema.validateSync(req.body, { abortEarly: false }) // esse tryCatch vai te ajudar muito na sua vida ainda
    } catch (err) {
      return res.status(400).json({ error: err.errors })
    }

    const productsIds = req.body.products.map((product) => product.id)


    const updatedProducts = await Products.findAll({
      where: { id: productsIds },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        }
      ]
    })



    const finalProduct = updatedProducts.map((product) => {

      const Index = req.body.products.findIndex(
        (requests) => requests.id === product.id)



      const newProducts = {
        id: product.id,
        name: product.name,
        price: product.price,
        url: product.url,
        category: product.category.name,
        quantity: req.body.products[Index].quantity,
      }
      return newProducts
    })

    if (finalProduct.length < 1) {
      return res.status(400).json({ error: "Product not found make sure data is correct" })
    }

    const order = {
      user: {
        id: req.userId,
        name: req.userName,
      },
      products: finalProduct,
      status: 'Em preparação',
    }

    const finalOrder = await Order.create(order)

    return res.status(201).json({ message: "Pedido realizado com sucesso" })
  }

  async index(req, res) {
    const allOrders = await Order.find()

    return res.json(allOrders)
  }

  async update(req, res) {

    const schema = Yup.object().shape({
      status: Yup.string().required()
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
    const { status } = req.body
    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (error) {
      return res.status(400).json({ error, message: "Provavelmente o id do pedido ta errado" })
    }


    return res.json({ message: "Status atualizado com sucesso" })
  }


  async delete(req, res) {

    const { admins: isAdmin } = await User.findByPk(req.userId)
    //para validar se o usuario é admin
    if (!isAdmin) {
      return res.status(401).json({ error: "no permission" })
    }


    const { id } = req.params
    console.log(id)
    try {
      await Order.deleteOne({ id: id })

    } catch (error) {
      return res.status(400).json({ error, message: "Provavelmente o id do pedido ta errado" })
    }


    return res.json({ message: "Status atualizado com sucesso" })
  }


}
export default new OrderController()
