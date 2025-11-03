const Post = require('../models/Post');

// GET /api/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email').populate('category', 'name slug').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/posts/:id
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email').populate('category', 'name slug');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/posts
exports.createPost = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    const post = new Post({
      title,
      body,
      category,
      author: req.user._id
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/posts/:id
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    // only author or admin can edit (simple check)
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const { title, body, category } = req.body;
    post.title = title || post.title;
    post.body = body || post.body;
    post.category = category || post.category;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.remove();
    res.json({ message: 'Post removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
