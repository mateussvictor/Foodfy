const Recipe = require('../../models/admin/Recipe')
const { date } = require('../../../lib/utils')


module.exports = {

  index(req, res) {
    let { filter, page, limit } = req.query

    page = page || 1
    limit = limit || 6
    let offset = limit * (page - 1)

    const params = {
      filter,
      page,
      limit,
      offset,
      callback(recipes) {

        let mathTotal = recipes[0] == undefined ? 0 : Math.ceil(recipes[0].total / limit)

        const pagination = {
          total: mathTotal,
          page
        }

        return res.render('admin/recipes/index.njk', { filter, pagination, recipes })
      }
    }

    Recipe.paginate(params)
  },

  show(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send('Recipe not found!')

      recipe.created_at = date(recipe.created_at).format

      return res.render('admin/recipes/show', { recipe })
    })
  },

  create(req, res) {
    Recipe.chefsSelectOptions((options) => {
      return res.render('admin/recipes/create.njk', { chefOptions: options })
    })
  },

  post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    Recipe.create(req.body, (recipe) => {
      return res.redirect(`/admin/recipes/${recipe.id}`)
    })
  },
  
  edit(req, res) {
    Recipe.find(req.params.id, (recipe) => {
      if(!recipe) return res.send('Recipe not found!')

      recipe.created_at = date(recipe.created_at).format

      Recipe.chefsSelectOptions((options) => {
        return res.render('admin/recipes/edit', { chefOptions: options, recipe })
      })
    })
  },

  put(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    Recipe.update(req.body, () => {
      return res.redirect(`/admin/recipes/${req.body.id}`)
    })
  },

  delete(req, res) {
    Recipe.delete(req.body.id, () => {
      return res.redirect(`/admin/recipes`)
    })
  },
}
