const db = require('../../config/db');

module.exports = {

  all(callback) { 
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

  create(data, callback) {
    const query = `
      INSERT INTO chefs (
        name,
        avatar_url,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      data.avatar_url,
      data.created_at,
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows[0])
    })
  },

  find(id, callback) {
    db.query(`
      SELECT chefs.*, count(recipes) AS total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      WHERE chefs.id = $1
      GROUP BY chefs.id`,
      [id],

        (err, results) => {
          if(err) throw `Database Error! ${err}`

        callback(results.rows[0])
    })
  },

  update(data, callback) {
    const query = `
      UPDATE chefs SET
        name=($1),
        avatar_url=($2)
      WHERE id = $3
    `

    const values = [
      data.name,
      data.avatar_url,
      data.id
    ]

    db.query(query, values, (err, results) => {
      if(err) throw `Database Error! ${err}`

      return callback()
    })
  },

  delete(id, callback) {
    db.query(`
      DELETE FROM chefs where id = $1`,
      [id],
      
      (err, results) => {
      if(err) throw `Database Error! ${err}`

      return callback()
    })
  },

  listRecipes(id, callback) {
    db.query(`
      SELECT recipes.*, chefs.name AS chef_name
      FROM recipes
      LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
      WHERE chef_id = $1`,
      [id],
    
    (err, results) => {
      if(err) throw `Database Error! ${err}`

      callback(results.rows)
    }) 
  },

  paginate(params) {
    const { filter, limit, offset, callback } = params

    let query = "",
      filterQuery = "",
      totalQuery = `(
        SELECT count(*) FROM chefs
      ) AS total`

    if (filter) {
      filterQuery = `
        WHERE chefs.name ILIKE '%${filter}%'
      `

      totalQuery = `(
        SELECT count(*) FROM chefs
        ${filterQuery}
      ) AS total`
    }

    query = `
      SELECT chefs.*, ${totalQuery}, count(recipes) as total_recipes
      FROM chefs
      LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
      ${filterQuery}
      GROUP BY chefs.id
      LIMIT $1 OFFSET $2
    `

    db.query(query, [limit, offset], (err, results) => {
      if(err) throw `Database error ${err}`

      callback(results.rows)
    })
  }
}
