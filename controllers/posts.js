const Post = require('../models/post');

exports.addPost = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    owner: req.user._id
  });
  post
    .save()
    .then(newPost => {
      res.status(201).send({
        message: 'Posts saved successfully',
        post: { ...newPost, id: newPost._id }
      });
    })
    .catch(error => {
      res.status(500).send({ message: "Post couldn't be added" });
    });
};

exports.getAllPosts = async (req, res) => {
  try {
    const pageSize = +req.query.pageSize,
      currentPage = +req.query.currentPage;
    let fetchedPosts;
    let maxPostCount;
    if (pageSize && currentPage) {
      fetchedPosts = await Post.find()
        .skip(pageSize * (currentPage - 1))
        .limit(pageSize);
      maxPostCount = await Post.countDocuments();
    }
    res.status(200).send({
      message: 'Posts retreived successfully',
      posts: fetchedPosts,
      maxPostCount
    });
  } catch (error) {
    res.status(500).send({
      message: "Posts couldn't be retreived",
      error
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id, owner: req.user._id });
    res.status(200).send({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(401).send({ message: "Posts couldn't be deleted" });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById({ _id: req.params.id });
    res.status(200).send(post);
  } catch (error) {
    res.status(404).send({ error });
  }
};

exports.editPost = async (req, res) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath,
    owner: req.user._id
  });
  try {
    await Post.updateOne({ _id: req.params.id, owner: req.user._id }, post);
    res.status(200).send({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(401).send({ message: "Posts couldn't be retreived" });
  }
};
