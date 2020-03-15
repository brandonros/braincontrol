const pg = require('pg')

let pool = null

const queryDatabase = async (sqlStatement) => {
  if (!pool) {
    pool = new pg.Pool({
      host: process.env.PGBOUNCER_HOST,
      port: process.env.PGBOUNCER_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD
    })
  }
  const connection = await pool.connect()
  try {
    const { rows } = await connection.query(sqlStatement.text, sqlStatement.values)
    return rows
  } finally {
    connection.release()
  }
}

module.exports = {
  queryDatabase
}
