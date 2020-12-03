const express = require('express')
const routes = express.Router()

const ProfileController = require('../app/controllers/admin/ProfileController')
const ProfileValidator = require('../app/validators/profile')

const {
  onlyUsers,
} = require("../app/middlewares/session")


routes.get('/', onlyUsers, ProfileValidator.show, ProfileController.index)
routes.put('/', onlyUsers, ProfileValidator.update, ProfileController.update)

module.exports = routes