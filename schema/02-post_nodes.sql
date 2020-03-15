CREATE TABLE IF NOT EXISTS post_nodes(
  post_id INTEGER REFERENCES posts (post_id) ON DELETE CASCADE,
  node_id INTEGER REFERENCES nodes (node_id) ON DELETE CASCADE,

  PRIMARY KEY (post_id, node_id)
);
