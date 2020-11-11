const db = require('../../config/db')
const { date } = require('../../../lib/utils')


module.exports = {
  create(data, fileId) {
    const query = `
      INSERT INTO chefs (
        name,
        file_id,
        created_at
      ) VALUES ($1, $2, $3)
      RETURNING id
    `

    const values = [
      data.name,
      fileId,
      date(Date.now()).iso,
    ]

    try {
      return db.query(query, values)
    } catch (err) {
      throw new Error(err)
    }
  },

  find(id) {
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

  update(data, fileId) {
    if(fileId) {
      const query = `
        UPDATE chefs SET
          name=($1),
          file_id=($2)
        WHERE id = $3
      `

      const values = [
        data.name,
        fileId,
        data.id,
      ]

      return db.query(query, values)

    } else {
      const query = `
        UPDATE chefs SET
        name = ($1)
        WHERE id = $2
      `

      const values = [
          data.name,
          data.id
      ]

      return db.query(query, values)
    }

  },

  delete(id) {
    try {
      db.query(`
        DELETE FROM chefs where id = $1`,
        [id]
      )
    } catch (err) {
      throw new Error(err)
    }
  },

  findRecipes(id) {
    try {
      return db.query(`
        SELECT recipes.*, chefs.name AS chef_name
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
        WHERE chef_id = $1`,
        [id]
      )
    } catch (err) {
      throw new Error(err)
    }
  },

  file(id) {
    return db.query(`
      SELECT * FROM files WHERE id = $1`,
      [id]
    )
},

  async paginate(params) {
    const { filter, limit, offset } = params

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

    try {
      return db.query(query, [limit, offset]) 
    } catch (err) {
      throw new Error(err)
    }
  },
}
