const Post = require("../models/post");
const { isValidObjectId } = require("mongoose");

const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const postsPromise = Post.find()
      .populate("userId", "name email")
      .skip(Number(skip))
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalPromise = Post.countDocuments();
    const [posts, total] = await Promise.all([postsPromise, totalPromise]);

    res.status(200).json({
      status: "success",
      message: "Posts fetched successfully",
      data: posts,
      pagination: {
        page: Number(page),
        total,
        totalPages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post id",
      });
    }

    const post = await Post.findById(id).populate("userId", "name email");

    if (!post) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Post fetched successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching post",
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content || !userId) {
      return res.status(400).json({
        status: "error",
        message: "Title, content, and userId are required",
      });
    }

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid userId",
      });
    }

    const newPost = await Post.create({ title, content, userId });
    const populatedPost = await Post.findById(newPost._id).populate(
      "userId",
      "name email"
    );

    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error creating post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post id",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!updatedPost) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid post id",
      });
    }

    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({
        status: "error",
        message: "Post not found",
      });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting post",
      error: error.message,
    });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
