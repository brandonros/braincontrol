const express = require('express')
const fetch = require('node-fetch')
const { renderTemplate } = require('./lib/templating.js')
const { fetchJson } = requrie('./lib/api.js')

const renderIndex = async () => {
  const model = {
    posts: await fetchJson(`${process.env.API_URL}/posts`)
  }
  return renderTemplate('/index.ejs', model)
}

const renderPost = async (postId) => {
  const model = {
    post: await fetchJson(`${process.env.API_URL}/post/${postId}`),
    postNodes: post: await fetchJson(`${process.env.API_URL}/post/${postId}/nodes`)
  }
  return renderTemplate('/post.ejs', model)
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
app.listen(process.env.PORT, () => console.log('Listening...'))
