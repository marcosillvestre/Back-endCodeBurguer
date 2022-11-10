import { Router } from 'express'

import multer from 'multer'
import multerConfig from './config/multer'

import CategoriesController from './app/controllers/Categories'
import UserController from './app/controllers/UserControler'
import SessionControler from './app/controllers/SessionControler'
import ProductsController from './app/controllers/ProductsController'
import OrderControler from './app/controllers/OrderControler'

import auth from './app/middlewares/auth'

const upload = multer(multerConfig)

const routes = new Router()

routes.post('/users', UserController.store)
routes.get('/users', UserController.index)



routes.post('/sessions', SessionControler.store)

routes.use(auth)   /*'👇👇👇'*/

routes.post('/products', upload.single('file'), ProductsController.store)
routes.get('/products', ProductsController.index)
routes.put('/products/:id', upload.single('file'), ProductsController.update)
routes.delete('/products/:id', ProductsController.delete)



routes.post('/categories', upload.single('file'), CategoriesController.store)
routes.get('/categories', CategoriesController.index)
routes.put('/categories/:id', upload.single('file'), CategoriesController.update)


routes.post('/orders', OrderControler.store)
routes.get('/orders', OrderControler.index)
routes.put('/orders/:id', OrderControler.update)

routes.delete('/orders/:id', OrderControler.delete)





export default routes

// store = cadastrar,
// index = listar todos,
// show = listar um ,
// update = atualizar,
// delete = deletar
