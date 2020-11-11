const Recipe = require('../../models/admin/Recipe')
const File = require('../../models/admin/File')
const Chef = require('../../models/admin/Chef')


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

    return res.render('admin/recipes/index.njk', { filter, pagination, recipes })
  },

  async show(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    results = await Recipe.files(recipe.id)
    let recipe_files = results.rows
    let filesId = recipe_files.map(row => row.file_id)

    let filesPromise = filesId.map(id => File.find(id))
    results = await Promise.all(filesPromise)

    const files = results.map(result => ({
        ...result.rows[0],
        src: `${req.protocol}://${req.headers.host}${result.rows[0].path.replace(
          "public","")}`
    }))

    return res.render('admin/recipes/show', { recipe, files })
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

    if(req.files.length == 0) {
      return res.send('Please, send at least one image.')
    }

    let results = await Recipe.create(req.body)
    const recipeId = results.rows[0].id

    const filesPromise = req.files.map(file => File.create({...file}))
    results = await Promise.all(filesPromise)

    
    const recipeFiles = results.map(result => result.rows[0])
    const recipeFilesPromise = recipeFiles.map(file => File.createRecipeFiles(file.id, recipeId))
    results = await Promise.all(recipeFilesPromise)

    return res.redirect(`/admin/recipes/${recipeId}`)
  },
  
  async edit(req, res) {
    let results = await Recipe.find(req.params.id)
    const recipe = results.rows[0]

    if(!recipe) return res.send('Recipe not found!')

    results = await Recipe.chefSelectOptions()
    const chefOptions = results.rows

    results = await Recipe.files(recipe.id)
    let filesId = results.rows
    filesId = filesId.map(file => file.file_id)

    let filesPromise = filesId.map(id => File.find(id))
    results = await Promise.all(filesPromise)

    let files = results.map(result => ({
      ...result.rows[0],
      src: `${req.protocol}://${req.headers.host}${result.rows[0].path.replace(
        "public","")}`
    }))
 
    return res.render(`admin/recipes/edit`, { recipe, chefOptions, files })
  },

  async put(req, res) {
    const keys = Object.keys(req.body)

    for(key of keys) {
      if(req.body[key] == '' && key != 'removed_files') {
        return res.send('Please, fill all fields.')
      }
    }

    if(req.files.length != 0) {
      const newFilesPromise = req.files.map(file => File.create(file))
      let results = await Promise.all(newFilesPromise)

      const recipeFilesPromises = results.map(file => {
          const fileId = file.rows[0].id
          File.createRecipeFiles(fileId, req.body.id)
      })
      await Promise.all(recipeFilesPromises)   
  }

    if(req.body.removed_files) {
      const removedFiles = req.body.removed_files.split(',')
      const lastIndex = removedFiles.length - 1
      removedFiles.splice(lastIndex, 1)

      const removedFilesPromise = removedFiles.map(id => {
        File.deleteRecipeFiles(id)
        File.delete(id)
      })

      await Promise.all(removedFilesPromise)
    }

    await Recipe.update(req.body)

    return res.redirect(`/admin/recipes/${req.body.id}`)
  },

  async delete(req, res) {
    await Recipe.delete(req.body.id)

    return res.redirect('/admin/recipes')
  },
}
