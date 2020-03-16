const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = (nodeId) => {
  return queryDatabase(SQL`SELECT posts.post_id,
      posts.title,
      posts.created_at
    FROM post_nodes
    JOIN posts ON posts.post_id = post_nodes.post_id
    WHERE post_nodes.node_id = ${nodeId}`)
}
