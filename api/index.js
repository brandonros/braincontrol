const express = require('express')
const SQL = require('sql-template-strings')
const pg = require('pg')

const databaseQuery = async (sqlStatement) => {
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

const upsertPost = async (title, content) => {
  const [post] = await queryDatabase(SQL`INSERT INTO posts(title, content)
    VALUES (${title}, ${content})
    ON CONFLICT DO
    UPDATE posts
    SET content = ${content}
    WHERE title = ${title}
    RETURNING post_id`)
  await queryDatabase(SQL`DELETE FROM post_nodes WHERE post_id = ${post.post_id}`)
  const nodesPattern = /(\[\[.*\]\])/g
  const nodes = content.match(nodesPattern)
  if (nodes) {
    for (let i = 0; i < nodes.length; ++i) {
      const nodeName = nodes[i]
      const [node] = await queryDatabase(SQL`INSERT INTO nodes(name) VALUES(${nodeName}) ON CONFLICT DO NOTHING RETURNING node_id`)
      await queryDatabase(SQL`INSERT INTO post_nodes(post_id, node_id) VALUES(${post.post_id}, ${node.node_id})`)
    }
  }
}

const getPost = async (title) => {
  const [post] = await queryDatabase(SQL`SELECT post_id, title, content, created_at FROM posts WHERE title = ${title}`)
  return post
}

const getPostNodes = async (title) => {
  return queryDatabase(SQL`SELECT nodes.node_id,
           nodes.name
    FROM post_nodes
    JOIN posts ON posts.post_id = post_nodes.post_id
    JOIN nodes ON nodes.node_id = post_nodes.node_id
    WHERE posts.title = ${title}`)
}

const app = express()
app.use(express.json())
app.put('/posts/:title', (req, res) => {
  upsertPost(req.params.title, req.body.content)
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:title', (req, res) => {
  getPost(req.params.title)
  .then((post) => res.send(post))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:title/nodes', (req, res) => {
  getPostNodes(req.params.title)
  .then((postNodes) => res.send(getPostNodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.listen(process.env.PORT, () => console.log('Listening...'))
