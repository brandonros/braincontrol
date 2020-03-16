const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = () => {
  return queryDatabase(SQL`SELECT node_id, name FROM nodes`)
}
