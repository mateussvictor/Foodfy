const express = require('express')
const routes = express.Router()

const SessionController = require('../app/controllers/SessionController')
const UserController = require('../app/controllers/admin/UserController')

const UserValidator = require('../app/validators/user')
const SessionValidator = require("../app/validators/session")
const FieldsValidator = require('../app/validators/fields')

const {
  isAdmin,
  isLoggedRedirectToProfile,
} = require("../app/middlewares/session")


routes.get('/login', isLoggedRedirectToProfile, SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)
routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.get('/password-reset', SessionController.resetForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/password-reset', SessionValidator.reset, SessionValidator.reset, SessionController.reset)

routes.get('/create', isAdmin, UserController.create)
routes.get('/:id', isAdmin, UserController.edit)

routes.get('/', isAdmin, UserController.list)
routes.post('/', isAdmin, FieldsValidator.isFilled, UserValidator.emailVerification, UserController.post)
routes.put('/', isAdmin, UserValidator.isItMeIsAdminVerification, FieldsValidator.isFilled, UserController.put)
routes.delete('/', isAdmin, UserValidator.del, UserController.delete)


module.exports = routes
