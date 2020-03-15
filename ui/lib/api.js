const fetch = require('node-fetch')

const fetchJson = async (url) => {
  const response = await fetch(url)
  if (response.status !== 200) {
    throw new Error(`Invalid response status: GET ${url} ${response.status} ${await response.text()}`)
  }
  return response.json()
}

module.exports = {
  fetchJson
}
