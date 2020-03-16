const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = async (nodeId) => {
  const [node] = await queryDatabase(SQL`SELECT node_id, name  FROM nodes WHERE node_id = ${nodeId}`)
  return node
}
