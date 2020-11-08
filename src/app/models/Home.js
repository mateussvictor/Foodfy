const db = require('../config/db');


module.exports = {

  all(callback) {
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`,
    
    (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },

  findOneRecipe(id, callback) { // encontra UMA receita (site)  
    db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE recipes.id = $1`,
      [id],

      (err, results) => {
        if(err) throw `Database Error! ${err}`

        callback(results.rows[0])
      }
    )
  },

  showChefs(id, callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      GROUP BY chefs.id
      ORDER BY total_recipes DESC`,

      (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    })
  },

  findOneChef(id, callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        WHERE chefs.id = $1
        GROUP BY chefs.id`,
        [id],

      (err, results) => {
        if(err) throw `Database Error! ${err}`

      callback(results.rows[0]);
  })
  },

  findBy(filter, callback) { // NÃO está sendo usado
    db.query(`
    SELECT recipes.*, chefs.name AS chef_name 
    FROM recipes
    LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
    WHERE recipes.title ILIKE '%${filter}%'
    OR chefs.name ILIKE '%${filter}%'
    GROUP BY recipes.id
    ORDER BY recipes.created_at DESC`,

    (err, results) => {
    if(err) throw `Database Error! ${err}`

    callback(results.rows)
  })
  },
}