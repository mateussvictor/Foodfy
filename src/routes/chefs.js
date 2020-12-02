const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const {onlyUsers , isAdmin } = require('../app/middlewares/session')

const ChefController = require('../app/controllers/admin/ChefController')


routes.get('/', onlyUsers, isAdmin, ChefController.index)
routes.get('/create', isAdmin, ChefController.create)
routes.get('/:id', onlyUsers, isAdmin, ChefController.show)
routes.get('/:id/edit', isAdmin, ChefController.edit)

routes.post('/', isAdmin, multer.array('photos', 1), ChefController.post)
routes.put('/', isAdmin, multer.array('photos', 1), ChefController.put)
routes.delete('/', isAdmin, ChefController.delete)

module.exports = routes
