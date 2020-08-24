const express = require('express');
const recipes = require('./controllers/admin');
const publicController = require('./controllers/public');

const routes = express.Router();

routes.get('/', publicController.home);
routes.get('/about', publicController.about);
routes.get('/recipes', publicController.recipes);
routes.get('/recipes/:id',  publicController.recipeId);

routes.get('/admin/recipes', recipes.index);
routes.get('/admin/recipes/create', recipes.create);
routes.get('/admin/recipes/:id', recipes.show);
routes.get('/admin/recipes/:id/edit', recipes.edit);

routes.post('/admin/recipes', recipes.post);
routes.put('/admin/recipes', recipes.put);
routes.delete('/admin/recipes', recipes.delete);

module.exports = routes;
