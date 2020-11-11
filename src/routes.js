const RecipeController = require('./app/controllers/admin/RecipeController')
const HomeController = require('./app/controllers/HomeController')
const ChefController = require('./app/controllers/admin/ChefController')

const multer = require('./app/middlewares/multer')

const express = require('express')
const routes = express.Router()


routes.get('/', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.showRecipe)
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.showChef)
routes.get('/search', HomeController.search)


routes.get('/admin/recipes', RecipeController.index)
routes.get('/admin/recipes/create', RecipeController.create)
routes.get('/admin/recipes/:id', RecipeController.show)
routes.get('/admin/recipes/:id/edit', RecipeController.edit)
routes.post('/admin/recipes', multer.array('photos', 5), RecipeController.post)
routes.put('/admin/recipes/:id', multer.array('photos', 5), RecipeController.put)
routes.delete('/admin/recipes', RecipeController.delete)

routes.get('/admin/chefs', ChefController.index)
routes.get('/admin/chefs/create', ChefController.create)
routes.get('/admin/chefs/:id', ChefController.show)
routes.get('/admin/chefs/:id/edit', ChefController.edit)
routes.post('/admin/chefs', multer.array('photos', 1), ChefController.post)
routes.put('/admin/chefs/:id', multer.array('photos', 1), ChefController.put)
routes.delete('/admin/chefs', ChefController.delete)

module.exports = routes
