const express = require('express');
const nunjucks = require('nunjucks');
const recipes = require('./data.js');

const server = express();

server.use(express.static('public'));
server.set('view engine', 'njk');

nunjucks.configure('views', {
  express: server,
  autoescape: false,
  noCache: true,
});

server.get('/', (req, res) => res.render('home', { recipes }));

server.get('/about', (req, res) => res.render('about'));

server.get('/recipes', (req, res) => res.render('recipes', { recipes }));

server.get('/recipes/:id', (req, res) => {
  const { id } = req.params;
  if (!recipes[id]) {
    return res.render('error');
  }

  return res.render('recipe', { item: recipes[id] });
});

server.listen(5000, () => {
  console.log('Server is running.');
});
