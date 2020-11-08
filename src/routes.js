const RecipeController = require('./app/controllers/admin/RecipeController');
const HomeController = require('./app/controllers/HomeController');
const ChefController = require('./app/controllers/admin/ChefController');

const express = require('express');
const routes = express.Router();

// public routes
routes.get('/', HomeController.home);
routes.get('/about', HomeController.about);
routes.get('/recipes', HomeController.recipes);
routes.get('/recipes/:id', HomeController.showRecipe);
routes.get('/chefs', HomeController.chefs)
routes.get('/chefs/:id', HomeController.showChef);
routes.get('/search', HomeController.search);


// ADMIN ROUTES
routes.get('/admin/recipes', RecipeController.index);
routes.get('/admin/recipes/create', RecipeController.create);
routes.get('/admin/recipes/:id', RecipeController.show);
routes.get('/admin/recipes/:id/edit', RecipeController.edit);

routes.post('/admin/recipes', RecipeController.post);
routes.put('/admin/recipes/:id', RecipeController.put);
routes.delete('/admin/recipes', RecipeController.delete);



// routes.get('/admin/recipes', recipes.index);
// routes.get('/admin/recipes/create', recipes.create);
// routes.get('/admin/recipes/:id', recipes.showRecipe);
// routes.get('/admin/recipes/:id/edit', recipes.edit);
// routes.post('/admin/recipes', multer.array('photos', 5), recipes.post);
// routes.put('/admin/recipes/:id', multer.array('photos', 5), recipes.put);
// routes.delete('/admin/recipes', recipes.delete);

routes.get('/admin/chefs', ChefController.index);
routes.get('/admin/chefs/create', ChefController.create);
routes.get('/admin/chefs/:id', ChefController.show);
routes.get('/admin/chefs/:id/edit', ChefController.edit);
routes.post('/admin/chefs', ChefController.post);
routes.put('/admin/chefs/:id', ChefController.put);
routes.delete('/admin/chefs', ChefController.delete);

module.exports = routes;
