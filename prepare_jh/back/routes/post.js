const express = require('express');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Post, Image, Comment, Hashtag } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();

try {
  //해당 폴더가 있는지 검사해서 없으면 에러 발생
  fs.accessSync('uploads');
} catch (error) {
  //에러가 발생하면 폴더를 생성
  console.log('uploads 폴더가 없으므로 생성합니다.');
  fs.mkdirSync('uploads');
}

//multer는 이렇게 requestMapping 단위로 한다.
//이유는 간단한다...요청마다..필요한 곳이 다르니깐
const upload = multer({
  //어디다 저장할거냐..여기서는 하드에 저장
  //실무에는 aws s3 같은 곳에 저장
  //이유는 aws 인스턴스에 위치하면 스케일링 시 이 파일도 같이 복사가 되니깐...
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      //제로초.png
      const ext = path.extname(file.originalname); //확장자 추출 (.png)
      const basename = path.basename(file.originalname, ext); //제로초
      //같은 파일명으로 다른 사용자의 파일을 덮어쓸 수 있기 때문에 타임스탬프를 붙인다.
      done(null, basename + '_' + new Date().getTime() + ext); //제로초_15184712891.png
    },
    limits: { fileSize: 20 * 1024 * 1024 }, //20MB
  }),
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const post = await Post.create({
      content: req.body.content,
      UserId: req.user.id,
    });

    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) =>
          Hashtag.findOrCreate({
            where: { name: tag.slice(1).toLowerCase() },
          })
        )
      );

      //findOrCreate 처리 시 리턴값이 다음과 같은 형태여서 map으로 꺼내서 넣어줘야 한다.
      //[#[노드, true], [리액트, true]]
      await post.addHashtags(result.map((v) => v[0]));
    }

    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        //이미지를 여러개 올리면 image: [제로초.png, 부기초.png] 형태로 올라온다.
        const images = await Promise.all(
          req.body.image.map((image) => Image.create({ src: image }))
        );
        await post.addImages(images);
      } else {
        //이미지를 한 개 올리면 image: 제로초.png
        const image = await Image.create({ src: req.body.image });
        await post.addImages(image);
      }
    }

    const fullPost = await Post.findOne({
      where: { id: post.id },
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC'],
      ],
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ['id', 'nickname'],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ['id', 'nickname'],
        },
        {
          model: User, // 좋아요 누른 사람
          as: 'Likers',
          attributes: ['id'],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  '/images',
  isLoggedIn,
  upload.array('image'),
  async (req, res, next) => {
    //여기는 이미지 업로드 후에 실행
    //req.files에 이미지에 대한 정보가 들어 있다.
    console.log(req.files);
    res.status(200).json(req.files.map((v) => v.filename));
  }
);

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });

    if (!post) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }

    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.user.id,
    });

    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname'],
        },
      ],
    });

    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.addLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await post.removeLikers(req.user.id);
    res.json({ PostId: post.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
  // DELETE /post/10
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
