module.exports = async (postId) => {
  const model = {
    post: await fetchJson(`${process.env.API_URL}/api/posts/${postId}`),
    postNodes: await fetchJson(`${process.env.API_URL}/api/posts/${postId}/nodes`)
  }
  return renderTemplate('/post.ejs', model)
}
