const db = require('../config/db')


module.exports = {

  all() {
    try {
      return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`
    )
    } catch (err) {
      throw new Error(err)
    }
  },

  findOneRecipe(id) {
    try {
      return db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`,
      [id]
    )
    } catch (err) {
      throw new Error(err)
    } 
  },

  showChefs(id) {
    try {
      return db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`
    )
    } catch (err) {
      throw new Error(err)
    }
  },

  findOneChef(id) {
   try {
    return db.query(`
    SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
      [id]
    )
   } catch (err) {
     throw new Error(err)
   }
  },
}
