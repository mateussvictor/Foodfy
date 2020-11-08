const Home = require('../models/Home')
const Chef = require('../models/admin/Chef')
const Recipe = require('../models/admin/Recipe')


module.exports = {

  async home(req, res) {
    results = await Home.all()
    items = results.rows

    return res.render('foodfy/home', { items })
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

    return res.render('foodfy/recipes', { filter, pagination, items })
  },

  async showRecipe(req, res) {
    results = await Home.findOneRecipe(req.params.id)
    const recipe = results.rows[0]

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

    let results = await Chef.paginate(params);
    let chefs = results.rows;
    
    let mathTotal = chefs[0] == undefined ? 0 : Math.ceil(chefs[0].total / limit)

    const pagination = {
      total: mathTotal,
      page
    }

    return res.render('foodfy/chefs', { filter, pagination, chefs })
  },

  async showChef(req, res) {
    let results = await Home.findOneChef(req.params.id)
    chef = results.rows[0]

    results = await Chef.findRecipes(chef.id)
    items = results.rows

    return res.render('foodfy/showChef', { chef, items })
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

    return res.render('foodfy/search', { filter, pagination, items })
  }
}
