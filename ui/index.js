const express = require('express')
const { renderTemplate } = require('./lib/templating.js')
const { fetchJson } = require('./lib/api.js')

const renderIndex = async () => {
  const model = {
    posts: await fetchJson(`${process.env.API_URL}/api/posts`)
  }
  return renderTemplate('/index.ejs', model)
}

const renderPost = async (postId) => {
  const model = {
    post: await fetchJson(`${process.env.API_URL}/api/posts/${postId}`),
    postNodes: await fetchJson(`${process.env.API_URL}/api/posts/${postId}/nodes`)
  }
  return renderTemplate('/post.ejs', model)
}

const renderNode = async (nodeId) => {
  const model = {
    node: await fetchJson(`${process.env.API_URL}/api/nodes/${nodeId}`),
    posts: await fetchJson(`${process.env.API_URL}/api/nodes/${nodeId}/posts`)
  }
  return renderTemplate('/node.ejs', model)
}

const app = express()
app.get('/', (req, res) => {
  renderIndex()
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.get('/posts/:postId', (req, res) => {
  renderPost(req.params.postId)
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.get('/nodes/:nodeId', (req, res) => {
  renderNode(req.params.nodeId)
  .then((output) => res.send(output))
  .catch((err) => res.status(500).send(err.stack))
})
app.listen(process.env.PORT, () => console.log('Listening...'))
