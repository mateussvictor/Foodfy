const data = require('../data.json');
const fs = require('fs');


exports.index = (req, res) => {
  return res.render('./admin/recipes', { recipes: data.recipes });
};

exports.show = (req, res) => {
  const { id } = req.params;

  const foundRecipe = data.recipes.find((recipe, index) => {
    return id == index + 1;
  });

  const recipe = {
    ...foundRecipe,
  };

  if (!foundRecipe) return res.send('Recipe not found');

  return res.render('./admin/show', { recipe });
};

exports.create = (req, res) => {
  return res.render('./admin/create');
};

exports.edit = (req, res) => {

  const { id } = req.params

  const foundRecipe = data.recipes.find((recipe) =>{
      return recipe.id == id
  })

  if(!foundRecipe) return res.send("Receita não encontrada")

  const recipe = {
      ...foundRecipe
  }

  return res.render('./admin/edit', { recipe });
};

exports.post = (req, res) => {

  const keys = Object.keys(req.body);

  for (key of keys) {
    if(req.body[key] == '') {
      return res.send('Please, fill all fields.')
    }
  }

  let id = 1
  const lastRecipe = data.recipes[data.recipes.length - 1];


  if(lastRecipe) {
    id = lastRecipe.id + 1
  }

  data.recipes.push({
    id,
    ...req.body,
  });

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
    if(error) return res.send('Write file error')

    return res.redirect('../admin/recipes')
  })
};

exports.put = (req, res) => {
  const { id } = req.body;
  let index = 0;

  const foundRecipe = data.recipes.find((recipe, foundIndex) => {
    if(id == recipe.id) {
      index = foundIndex;
      return true
    }
  });

  if(!foundRecipe) return res.send('Recipe not found.')

  const recipe = {
    ...foundRecipe,
    ...req.body,
    id: Number(req.body.id)
  }

  data.recipes[index] = recipe

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
    if(error) return res.send('Write file error.')

    return res.redirect(`/admin/recipes/${id}`)
  })
}

exports.delete = (req, res) => {
  const { id } = req.body;

  const filteredRecipes = data.recipes.filter((recipe) => {
    return recipe.id != id
  })

  data.recipes = filteredRecipes

  fs.writeFile('data.json', JSON.stringify(data, null, 2), (error) => {
    if(error) return res.send('Write file error.')

    return res.redirect('/admin/recipes');
  })
}
