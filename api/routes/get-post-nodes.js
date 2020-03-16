const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = (postId) => {
  return queryDatabase(SQL`SELECT nodes.node_id,
      nodes.name
    FROM post_nodes
    JOIN nodes ON nodes.node_id = post_nodes.node_id
    WHERE post_nodes.post_id = ${postId}`)
}
