const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = () => {
  return queryDatabase(SQL`SELECT post_id, title, created_at FROM posts`)
}
