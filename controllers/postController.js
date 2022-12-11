const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const newPost = {
      content,
      postedBy: req.decoded.id,
    };
    const post = await new Post(newPost).save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.readPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      res.status(400).json({ msg: 'Post does not exist' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      res.status(400).json({ msg: 'Post does not exist' });
    }
    await Post.findOneAndDelete({ _id: id });
    res.json({ msg: 'delete successful' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const { newContent } = req.body;
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      res.status(400).json({ msg: 'Post does not exist' });
    }
    const newPost = await Post.findOneAndUpdate(
      { _id: id },
      { $set: { content: newContent } },
      { new: true }
    );
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
