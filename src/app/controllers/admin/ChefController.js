const Chef = require('../../models/admin/Chef')
const File = require('../../models/admin/File')
const Recipe = require('../../models/admin/Recipe')


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

    let results = await Chef.paginate(params)
    chefs = results.rows
    
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

    return res.render('admin/chefs/index', { filter, pagination, chefs })
  },

  async show(req, res) {
    let results = await Chef.find(req.params.id)
    let chef = results.rows[0]

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

    return res.render('admin/chefs/show', { chef, recipes, file })
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
    
    if(req.files.length == 0) {
      return res.send('Please, send at least one image.')
    }

    let result = await File.create(...req.files)
    let fileId = result.rows[0].id

    result = await Chef.create(req.body, fileId)
    let chefId = result.rows[0].id


    return res.redirect(`/admin/chefs/${chefId}`)
  },
  
  async edit(req, res) {
    let result = await Chef.find(req.params.id)
    const chef = result.rows[0]

    if(!chef) return res.send('Chef not found!')

  
    results = await File.find(chef.file_id)
    let files = results.rows
    files = files.map((file) => ({
      ...file,
      file_path: `${req.protocol}://${req.headers.host}${file.path.replace(
        "public",
        ""
      )}`,
    }))

    return res.render('admin/chefs/edit', { chef, files })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    results = await Chef.find(req.body.id)
    let file_id = results.rows[0].file_id

    for(key of keys) {
      if(req.body[key] == '' && key != 'removed_files') {
        return res.send('Please, fill all fields.')
      }
    }

    if (req.files.length != 0) {
      results = await File.create(...req.files)
      file_id = results.rows[0].id
    }

    if(req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(',')
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      await File.delete(removedFiles)
    }

    Chef.update(req.body, file_id)


    return res.redirect(`/admin/chefs/${req.body.id}`)
  },

  async delete(req, res) {
    results = await Chef.find(req.body.id)
    const chef = results.rows[0]

    if (chef.total_recipes > 0)
      return res.send("You cannot delete a chef who has recipes.")

    await Chef.delete(req.body.id)
    await File.delete(chef.file_id)

    return res.redirect(`/admin/chefs`)
  },
}
