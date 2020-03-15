const express = require('express')
const SQL = require('sql-template-strings')
const { queryDatabase } = require('./lib/database.js')

const getPosts = async () => {
  return queryDatabase(SQL`SELECT post_id, title, created_at FROM posts`)
}

const updatePostNodes = async (postId, content) => {
  await queryDatabase(SQL`DELETE FROM post_nodes WHERE post_id = ${postId}`)
  const nodesPattern = /(\[\[.*\]\])/g
  const nodes = content.match(nodesPattern)
  if (nodes) {
    for (let i = 0; i < nodes.length; ++i) {
      const nodeName = nodes[i]
      const [node] = await queryDatabase(SQL`INSERT INTO nodes(name) VALUES(${nodeName}) ON CONFLICT DO NOTHING RETURNING node_id`)
      await queryDatabase(SQL`INSERT INTO post_nodes(post_id, node_id) VALUES(${postId}, ${node.node_id})`)
    }
  }
}

const updatePost = async (postId, title, content) => {
  await queryDatabase(SQL`UPDATE posts
    SET content = ${content},
      title = ${title}
    WHERE post_id = ${postId}`)
  await queryDatabase(SQL`DELETE FROM post_nodes WHERE post_id = ${postId}`)
  await updatePostNodes(postId, content)
}

const insertPost = async (title, content) => {
  const [post] = await queryDatabase(SQL`INSERT INTO posts(title, content) VALUES(${title}, ${content})
    RETURNING post_id`)
  await updatePostNodes(post.post_id, content)
  return post.post_id
}

const getPost = async (postId) => {
  const [post] = await queryDatabase(SQL`SELECT post_id, title, content, created_at FROM posts WHERE post_id = ${postId}`)
  return post
}

const getPostNodes = async (postId) => {
  return queryDatabase(SQL`SELECT nodes.node_id,
           nodes.name
    FROM post_nodes
    JOIN nodes ON nodes.node_id = post_nodes.node_id
    WHERE post_nodes.post_id = ${postId}`)
}

const app = express()
app.use(express.json())
app.get('/posts', (req, res) => {
  getPosts()
  .then((posts) => res.send(posts))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.post('/posts', (req, res) => {
  insertPost(req.body.title, req.body.content)
  .then((postId) => res.send({ postId }))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.put('/posts/:postId', (req, res) => {
  updatePost(req.params.postId, req.body.title, req.body.content)
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:postId', (req, res) => {
  getPost(req.params.postId)
  .then((post) => res.send(post))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:postId/nodes', (req, res) => {
  getPostNodes(req.params.postId)
  .then((postNodes) => res.send(getPostNodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.listen(process.env.PORT, () => console.log('Listening...'))
