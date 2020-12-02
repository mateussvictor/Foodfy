const db = require('../../config/db')
const fs = require('fs')

const Base = require('../Base')

Base.init({ table: 'recipes' })


module.exports = {
  ...Base,

  async findAll() {
    try {
      const query = `
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        ORDER BY updated_at DESC`

      const results = await db.query(query)

      return results.rows

    } catch (err) {
      console.error(err)
    }
  },

  async findOne(id) {
    try {
      const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.id=$1`,
        [id])

      return results.rows[0]

    } catch (err) {
      console.error(err)
    }
  },

  async files(id) {
    try {
      const results = await db.query(`
        SELECT files.*, recipe_id, file_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`,
        [id])

      return results.rows

    } catch (err) {
      console.error(err)
    }
  },

  async delete(id) {
    try {
      const results = await db.query(`
        SELECT files.*, recipe_id, file_id
        FROM files
        LEFT JOIN recipe_files ON (files.id = recipe_files.file_id)
        WHERE recipe_files.recipe_id = $1`, 
        [id])

      const files = results.rows

      await db.query(`DELETE FROM recipes WHERE id = $1`, [id])

      files.map(async file => {fs.unlinkSync(`public/${file.path}`)
        await db.query(`DELETE FROM files WHERE id = $1`, [file.id])
      })

      return

    } catch (err) {
      console.error(err)
    }
  },

  async findBy(filter) {
    try {
      const results = await db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE recipes.title ILIKE '%${filter}%'
        ORDER BY updated_at DESC`)

      return results.rows

    } catch (err) {
      console.error(err)
    }
  },
}
