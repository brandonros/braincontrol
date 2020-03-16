const express = require('express')
const routes = {
  getPosts: require('./routes/get-posts.js'),
  getNodePosts: require('./routes/get-node-posts.js'),
  getNode: require('./routes/get-node.js'),
  getNodes: require('./routes/get-nodes.js'),
  getPostNodes: require('./routes/get-post-nodes.js'),
  getPost: require('./routes/get-post.js'),
  getPosts: require('./routes/get-posts.js'),
  insertPost: require('./routes/insert-post.js'),
  updatePost: require('./routes/update-post.js'),
}
const app = express()
app.use(express.json())
app.get('/posts', (req, res) => {
  routes.getPosts()
  .then((posts) => res.send(posts))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/nodes', (req, res) => {
  routes.getNodes()
  .then((nodes) => res.send(nodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.post('/posts', (req, res) => {
  routes.insertPost(req.body.title, req.body.content)
  .then((postId) => res.send({ postId }))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.put('/posts/:postId', (req, res) => {
  routes.updatePost(req.params.postId, req.body.title, req.body.content)
  .then(() => res.status(204).end())
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:postId', (req, res) => {
  routes.getPost(req.params.postId)
  .then((post) => res.send(post))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/posts/:postId/nodes', (req, res) => {
  routes.getPostNodes(req.params.postId)
  .then((postNodes) => res.send(postNodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/nodes/:nodeId/posts', (req, res) => {
  routes.getNodePosts(req.params.nodeId)
  .then((postNodes) => res.send(postNodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.get('/nodes/:nodeId', (req, res) => {
  routes.getNode(req.params.nodeId)
  .then((postNodes) => res.send(postNodes))
  .catch((err) => res.status(500).send({ error: err.stack }))
})
app.listen(process.env.PORT, () => console.log('Listening...'))
