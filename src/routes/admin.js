const express = require('express')
const routes = express.Router()

const {
  onlyUsers,
  isLoggedRedirectToProfile,
} = require("../app/middlewares/session")

const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const profile = require('./profile')

routes.use('/recipes', recipes)
routes.use('/chefs', chefs)
routes.use('/users', users)
routes.use('/profile', profile)


routes.get('/login', isLoggedRedirectToProfile, (req, res) => res.redirect('/admin/users/login'))
routes.get('/admin', onlyUsers, (req, res) => res.redirect('/admin/recipes'))

module.exports = routes