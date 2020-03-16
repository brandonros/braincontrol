const SQL = require('sql-template-strings')
const { databaseTransaction } = require('../lib/database.js')
const { updatePostNodes } = require('../lib/nodes.js')

module.exports = (title, content) => {
  return databaseTransaction(async (connection) => {
    const [post] = await connection.query(SQL`INSERT INTO posts(title, content) VALUES(${title}, ${content})
      RETURNING post_id`)
    await updatePostNodes(connection, post.post_id, content)
    return post.post_id
  })
}
