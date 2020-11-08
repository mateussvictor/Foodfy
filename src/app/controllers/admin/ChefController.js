const Chef = require('../../models/admin/Chef')


module.exports = {

  async index(req, res) {
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

    return res.render('admin/chefs/index', { filter, pagination, chefs })
  },

  async show(req, res) {
    let results = await Chef.find(req.params.id)
    chef = results.rows[0]

    results = await Chef.findRecipes(chef.id)
    items = results.rows

    return res.render('admin/chefs/show', { chef, items })
  },

  async create(req, res) {
    return res.render('admin/chefs/create.njk')
  },

  async post(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    let results = await Chef.create(req.body)
    chef_id = results.rows[0].id

    return res.redirect(`/admin/chefs/${chef_id}`)
  },
  
  async edit(req, res) {
    let results = await Chef.find(req.params.id)
    chef = results.rows[0]

    if(!chef) return res.send('Chef not found!')

    return res.render('admin/chefs/edit', { chef })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    results = await Chef.find(req.body.id)

    for(key of keys) {
      if(req.body[key] == '') {
        return res.send('Please, fill all fields.')
      }
    }

    Chef.update(req.body)

    return res.redirect(`/admin/chefs/${req.body.id}`)
  },

  async delete(req, res) {
    await Chef.delete(req.body.id)

    return res.redirect(`/admin/chefs`)
  },
}
