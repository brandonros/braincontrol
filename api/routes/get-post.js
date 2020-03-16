const SQL = require('sql-template-strings')
const { queryDatabase } = require('../lib/database.js')

module.exports = async (postId) => {
  const [post] = await queryDatabase(SQL`SELECT post_id, title, content, created_at FROM posts WHERE post_id = ${postId}`)
  return post
}
