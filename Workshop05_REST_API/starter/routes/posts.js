const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const router = express.Router();

router.param('id', (req, res, next, id) => {
  if (!mongoose.isObjectIdOrHexString(id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  next();
});

function validatePost(req, res, next) {
  const body = req.body;
  const fields = ['title', 'content', 'author'];
  if (!body || Array.isArray(body) || fields.some(field =>
    typeof body[field] !== 'string' || !body[field].trim())) {
    return res.status(400).json({ error: 'title, content and author must be non-empty strings' });
  }
  req.postData = { title: body.title.trim(), content: body.content.trim(), author: body.author.trim() };
  next();
}

router.post('/', validatePost, async (req, res, next) => {
  try {
    const post = await Post.create(req.postData);
    res.status(201).json(post);
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    res.json(await Post.find());
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) { next(error); }
});

router.put('/:id', validatePost, async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, { $set: req.postData }, {
      new: true, runValidators: true
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) { next(error); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) { next(error); }
});

module.exports = router;
