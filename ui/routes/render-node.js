const { renderTemplate } = require('../lib/templating.js')
const { fetchJson } = require('../lib/api.js')

module.exports = async (nodeId) => {
  const model = {
    node: await fetchJson(`${process.env.API_URL}/api/nodes/${nodeId}`),
    posts: await fetchJson(`${process.env.API_URL}/api/nodes/${nodeId}/posts`)
  }
  return renderTemplate('/node.ejs', model)
}
