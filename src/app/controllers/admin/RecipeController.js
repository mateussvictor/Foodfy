const Recipe = require('../../models/admin/Recipe')


module.exports = {

  async index(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
    }

    let results = await Recipe.paginate(params);
    let recipes = results.rows;

    let mathTotal =
      recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    return res.render('admin/recipes/index.njk', { filter, pagination, recipes })
  },

  async show(req, res) {
    results = await Recipe.find(req.params.id)
    const recipe = results.rows[0];

    return res.render('admin/recipes/show', { recipe })
  },

  async create(req, res) {
    results = await Recipe.chefSelectOptions()
    const chefOptions = results.rows

    return res.render('admin/recipes/create.njk', { chefOptions })
  },

  async post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

   let results = await Recipe.create(req.body)
   const recipeId = results.rows[0].id  

   return res.redirect(`/admin/recipes/${recipeId}`)
  },
  
  async edit(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if(!recipe) return res.send('Recipe not found!')

    results = await Recipe.chefSelectOptions();
    const chefOptions = results.rows;
 
    return res.render(`admin/recipes/edit`, { recipe, chefOptions })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    await Recipe.update(req.body)

    return res.redirect(`/admin/recipes/${req.body.id}`)
  },

  async delete(req, res) {
    await Recipe.delete(req.body.id)

    return res.redirect('/admin/recipes')
  },
}
