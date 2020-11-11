const Home = require('../models/Home')
const File = require('../models/admin/File')
const Chef = require('../models/admin/Chef')
const Recipe = require('../models/admin/Recipe')


module.exports = {

  async home(req, res) {
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
    let items = results.rows;

    let mathTotal =
      items[0] == undefined ? 0 : Math.ceil(items[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    items = items.map(async (item) => {
      let results = await Recipe.files(item.id)
      const file = results.rows[0].file_id
      results = await File.find(file)
      item.path = results.rows[0].path
      results = await Chef.find(item.chef_id)
      item.chef_name = results.rows[0].name
      return item
    })

    await Promise.all(items)

    items = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render('foodfy/home', { pagination, items })
  },

  about(req, res){
    return res.render('foodfy/about')
  },

  async recipes(req, res) {
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
    let items = results.rows;

    let mathTotal =
      items[0] == undefined ? 0 : Math.ceil(items[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    items = items.map(async (item) => {
      let results = await Recipe.files(item.id)
      const file = results.rows[0].file_id
      results = await File.find(file)
      item.path = results.rows[0].path
      results = await Chef.find(item.chef_id)
      item.chef_name = results.rows[0].name
      return item
    })

    await Promise.all(items)

    items = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render('foodfy/recipes', { filter, pagination, items })
  },

  async showRecipe(req, res) {
    results = await Home.findOneRecipe(req.params.id)
    let recipe = results.rows[0]

    results = await Recipe.files(recipe.id)
    const file = results.rows[0].file_id
    results = await File.find(file)
    recipe.path = results.rows[0].path
    results = await Chef.find(recipe.chef_id)
    recipe.chef_name = results.rows[0].name

    recipe.src = `${req.protocol}://${req.headers.host}${recipe.path.replace(
      "public",
      ""
    )}`

    return res.render('foodfy/recipe', { recipe })
  },

  async chefs(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 8
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
    }

    let results = await Chef.paginate(params)
    let chefs = results.rows
    
    let mathTotal = chefs[0] == undefined ? 0 : Math.ceil(chefs[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    chefs = chefs.map(async (chef) => {
      results = await File.find(chef.file_id)
      let file = results.rows[0]
      file = `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`

      chef.file_path = file
      return chef
    })

    chefs = await Promise.all(chefs)

    return res.render('foodfy/chefs', { filter, pagination, chefs })
  },

  async showChef(req, res) {
    let results = await Home.findOneChef(req.params.id)
    chef = results.rows[0]

    results = await File.find(chef.file_id)
    let file = results.rows[0]
    file.path = `${req.protocol}://${req.headers.host}${file.path.replace(
      "public",
      ""
    )}`
    
    results = await Chef.findRecipes(chef.id)
    recipes = results.rows
    
    recipes = recipes.map(async (recipe) => {
      let results = await Recipe.files(recipe.id)
      const file = results.rows[0].file_id
      results = await File.find(file)
      recipe.path = results.rows[0].path
      results = await Chef.find(recipe.chef_id)
      recipe.chef_name = results.rows[0].name
      return recipe
    })

    await Promise.all(recipes)

    recipes = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render('foodfy/showChef', { chef, recipes, file })
  },

  async search(req, res) {
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

    let results = await Recipe.paginate(params)
    let items = results.rows
    
    let mathTotal = items[0] == undefined ? 0 : Math.ceil(items[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    items = items.map(async (item) => {
      let results = await Recipe.files(item.id)
      const file = results.rows[0].file_id
      results = await File.find(file)
      item.path = results.rows[0].path
      results = await Chef.find(item.chef_id)
      item.chef_name = results.rows[0].name
      return item
    })

    await Promise.all(items)

    items = results.rows.map((file) => ({
      ...file,
      src: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render('foodfy/search', { filter, pagination, items })
  }
}
