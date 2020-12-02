const express = require("express")
const routes = express.Router()

const recipes = require("./recipes")
const chefs = require("./chefs")
const users = require("./users")


routes.use("/recipes", recipes)
routes.use("/chefs", chefs)
routes.use("/users", users)


module.exports = routes