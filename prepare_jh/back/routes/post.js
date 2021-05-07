const express = require('express');
const { User, Post, Image, Comment } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

router.get('/', isLoggedIn, (req, res) => {
  res.json([
    {
      id: 1,
      content: 'hello',
    },
    {
      id: 2,
      content: 'hello2',
    },
    {
      id: 3,
      content: 'hello3',
    },
  ]);
});

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
        },
        {
          model: User,
        },
      ],
    });
    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.body.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: req.body.params.postId,
      UserId: req.user.id,
    });
    res.status(200).json(comment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/', isLoggedIn, (req, res) => {
  //DELETE /post
  res.json({ id: 1 });
});

module.exports = router;
