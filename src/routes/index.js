const express = require('express')
const routes = express.Router()

const HomeController = require('../app/controllers/HomeController')

const admin = require("./admin")


routes.use("/admin", admin)

routes.get('/', HomeController.index)
routes.get('/home', HomeController.home)
routes.get('/about', HomeController.about)
routes.get('/recipes', HomeController.recipes)
routes.get('/recipes/:id', HomeController.recipe)
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.chef)


module.exports = routes
