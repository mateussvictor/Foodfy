const express = require('express')
const routes = express.Router()

const multer = require('../app/middlewares/multer')
const user = require('../app/middlewares/user')
const { onlyUsers } = require('../app/middlewares/session')

const FieldsValidator = require('../app/validators/fields')
const RecipeController = require('../app/controllers/admin/RecipeController')



routes.get('/', onlyUsers, RecipeController.index)
routes.get('/dashboard', onlyUsers, RecipeController.listMyRecipes)
routes.get('/create', onlyUsers, RecipeController.create)
routes.get('/:id', onlyUsers, RecipeController.show)
routes.get('/:id/edit', user.verifyEditCredentials, RecipeController.edit)

routes.post('/', FieldsValidator.isFilled, multer.array('photos', 5), RecipeController.post)
routes.put('/', FieldsValidator.isFilled, multer.array('photos', 5), RecipeController.put)
routes.delete('/', RecipeController.delete)

module.exports = routes
