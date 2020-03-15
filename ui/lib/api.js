const fetch = require('node-fetch')

const fetchJson = async (url) => {
  const response = await fetch(url)
  if (response.status !== 200) {
    throw new Error(`Invalid response status: ${response.status}`)
  }
  return response.json()
}

module.exports = {
  fetchJson
}
