const express = require('express')
const routes = {
  renderPosts: require('./routes/render-posts.js'),
  renderNodes: require('./routes/render-nodes.js'),
  renderPost: require('./routes/render-post.js'),
  renderNode: require('./routes/render-node.js')
}
const app = express()
app.get('/', (req, res) => {
  routes.renderPosts()
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.get('/nodes', (req, res) => {
  routes.renderNodes()
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.get('/posts/:postId', (req, res) => {
  routes.renderPost(req.params.postId)
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.get('/nodes/:nodeId', (req, res) => {
  routes.renderNode(req.params.nodeId)
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.listen(process.env.PORT, () => console.log('Listening...'))
