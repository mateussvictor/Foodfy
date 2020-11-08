const Chef = require('../../models/admin/Chef')
const { date } = require('../../../lib/utils')

module.exports = {

  index(req, res) {
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
        return res.render('admin/chefs/index', { filter, pagination, chefs })
      }
    }

    Chef.paginate(params)
  },

  show(req, res) {
    Chef.find(req.params.id, (chef) => {
      if(!chef) return res.send('Chef not found!')

      Chef.listRecipes(chef.id, (items) => {
        chef.created_at = date(chef.created_at).format
  
        return res.render('admin/chefs/show', { chef, items })
      })
    })
  },

  create(req, res) {
    return res.render('admin/chefs/create.njk')
  },

  post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    Chef.create(req.body, (chef) => {
      return res.redirect(`/admin/chefs/${chef.id}`)
    })
  },
  
  edit(req, res) {
    Chef.find(req.params.id, (chef) => {
      if(!chef) return res.send('Chef not found!')

      chef.created_at = date(chef.created_at).format

      return res.render('admin/chefs/edit', { chef })
    })
  },

  put(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    Chef.update(req.body, () => {
      return res.redirect(`/admin/chefs/${req.body.id}`)
    })
  },

  delete(req, res) {
    Chef.delete(req.body.id, () => {
      return res.redirect(`/admin/chefs`)
    })
  },
}
