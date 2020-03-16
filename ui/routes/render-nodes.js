module.exports = async () => {
  const model = {
    nodes: await fetchJson(`${process.env.API_URL}/api/nodes`)
  }
  return renderTemplate('/nodes.ejs', model)
}
