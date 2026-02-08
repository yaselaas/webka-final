const Post = require("../models/Post");
const { postCreateSchema, postUpdateSchema } = require("../validation/postValidation");

exports.createPost = async (req, res, next) => {
  try {
    const { error, value } = postCreateSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(" ") });

    const post = await Post.create({ ...value, author: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user.id }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  try {
    const { error, value } = postUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ message: error.details.map(d => d.message).join(" ") });

    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: "Post not found." });

    post.title = value.title;
    post.content = value.content;
    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ _id: req.params.id, author: req.user.id });
    if (!post) return res.status(404).json({ message: "Post not found." });

    await post.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};
