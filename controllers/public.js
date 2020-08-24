const data = require('../data.json');


exports.home = (req, res) => {
  res.render('home', { recipes: data.recipes });
};

exports.about = (req, res) => {
  res.render('about');
};

exports.recipes = (req, res) => {
  res.render('recipes', { recipes: data.recipes });
};

exports.recipeId = (req, res) => {
  const { id } = req.params;

  const foundRecipe = data.recipes.find((recipe, index) => {
    return id == index;
  });

  if (!foundRecipe) return res.send('Recipe not found');

  const recipe = {
    ...foundRecipe,
  };

  return res.render('recipe', { recipe });
}