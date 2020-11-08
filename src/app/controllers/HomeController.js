const Home = require('../models/Home')
const Chef = require('../models/admin/Chef')
const Recipe = require('../models/admin/Recipe')

const { date } = require('../../lib/utils');


module.exports = {

  home(req, res) {
    Home.all(items => {
      return res.render('foodfy/home', { items })
    })
  },

  about(req, res){
    return res.render('foodfy/about')
  },

  recipes(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(items) {

        let mathTotal = items[0] == undefined ? 0 : Math.ceil(items[0].total / limit)

        const pagination = {
          total: mathTotal,
          page
        }

        return res.render('foodfy/recipes', { filter, pagination, items })
      }
    }

    Recipe.paginate(params)
  },

  showRecipe(req, res) {
    Home.findOneRecipe(req.params.id, (recipe) => {
      if(!recipe) return res.send('Recipe not found!')

      recipe.created_at = date(recipe.created_at).format

      return res.render('foodfy/recipe', { recipe })
    })
  },

  chefs(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 8
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(chefs) {
        let mathTotal = chefs[0] == undefined ? 0 : Math.ceil(chefs[0].total / limit)

        const pagination = {
          total: mathTotal,
          page
        }
        return res.render('foodfy/chefs', { filter, pagination, chefs })
      }
    }

    Chef.paginate(params)
  },

  showChef(req, res) {
    Home.findOneChef(req.params.id, (chef) => {
      if(!chef) return res.send('Chef not found!')

      Chef.listRecipes(chef.id, items => {
        
        return res.render('foodfy/showChef', { chef, items })
      })
    })
  },

  search(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 3
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(items) {

        let mathTotal = items[0] == undefined ? 0 : Math.ceil(items[0].total / limit)

        const pagination = {
          total: mathTotal,
          page
        }

        return res.render('foodfy/search', { filter, pagination, items })
      }
    }

    Recipe.paginate(params)
  }
}