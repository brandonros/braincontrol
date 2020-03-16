const pg = require('pg')

let pool = null

const initDatabase = () => {
  if (!pool) {
    pool = new pg.Pool({
      host: process.env.PGBOUNCER_HOST,
      port: process.env.PGBOUNCER_PORT,
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD
    })
  }
}

const queryDatabase = async (sqlStatement) => {
  initDatabase()
  const connection = await pool.connect()
  try {
    const { rows } = await connection.query(sqlStatement.text, sqlStatement.values)
    return rows
  } finally {
    connection.release()
  }
}

const databaseTransaction = async (cb) => {
  initDatabase()
  const connection = await pool.connect()
  try {
    await connection.query('BEGIN')
    const wrappedConnection = {
      query: async (sqlStatement) => {
        const { rows } = await connection.query(sqlStatement.text, sqlStatement.values)
        return rows
      }
    }
    const result = await cb(wrappedConnection)
    await connection.query('COMMIT')
    return result
  } catch (err) {
    await connection.query('ROLLBACK')
    throw err
  } finally {
    connection.release()
  }
}

module.exports = {
  queryDatabase,
  databaseTransaction
}
