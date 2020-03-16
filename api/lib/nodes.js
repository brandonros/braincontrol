const SQL = require('sql-template-strings')

const updatePostNodes = async (connection, postId, content) => {
  await connection.query(SQL`DELETE FROM post_nodes WHERE post_id = ${postId}`)
  const nodesPattern = /(\[\[[^\[]*\]\])/g
  const nodes = content.match(nodesPattern)
  if (nodes) {
    for (let i = 0; i < nodes.length; ++i) {
      const nodeName = nodes[i]
      let [node] = await connection.query(SQL`SELECT node_id FROM nodes WHERE name = ${nodeName}`)
      if (!node) {
        [node] = await connection.query(SQL`INSERT INTO nodes(name)
          VALUES(${nodeName})
          RETURNING node_id`)
      }
      await connection.query(SQL`INSERT INTO post_nodes(post_id, node_id) VALUES(${postId}, ${node.node_id})`)
    }
  }
}

module.exports = {
  updatePostNodes
}
