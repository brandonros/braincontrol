const { renderTemplate } = require('../lib/templating.js')
const { fetchJson } = require('../lib/api.js')

module.exports = async () => {
  const model = {
    posts: await fetchJson(`${process.env.API_URL}/api/posts`)
  }
  return renderTemplate('/posts.ejs', model)
}
