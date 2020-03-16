const SQL = require('sql-template-strings')
const { databaseTransaction } = require('../lib/database.js')
const { updatePostNodes } = require('../lib/nodes.js')

module.exports = (postId, title, content) => {
  return databaseTransaction(async (connection) => {
    await connection.query(SQL`UPDATE posts
      SET content = ${content},
        title = ${title}
      WHERE post_id = ${postId}`)
    await connection.query(SQL`DELETE FROM post_nodes WHERE post_id = ${postId}`)
    await updatePostNodes(connection, postId, content)
  })
}
