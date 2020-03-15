const pg = require('pg')

const queryDatabase = async (sqlStatement) => {
  const client = new pg.Client({
    connectionString: process.env.DATABASE_URL
  })
  await client.connect()
  try {
    const { rows } = await client.query(sqlStatement.text, sqlStatement.values)
    return rows
  } catch (err) {
    throw err
  } finally {
    await client.end()
  }
}

module.exports = {
  queryDatabase
}
