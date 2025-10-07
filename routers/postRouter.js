const { Router } = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");

const router = Router();

// /posts
// get all posts
router.get("/", getAllPosts);

// get post by id
router.get("/:id", getPostById);

// create post
router.post("/", createPost);

// update post
router.patch("/:id", updatePost);

// delete post
router.delete("/:id", deletePost);

module.exports = router;
