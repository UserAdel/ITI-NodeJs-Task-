const { Router } = require("express");
const {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postsController");
const auth = require("../middlewares/auth");
const validator = require("../middlewares/validator");
const { createPostSchema, updatePostSchema } = require("../utils/schemas");

const router = Router();

// Protect all routes with authentication
router.use(auth);

// /posts
// get all posts
router.get("/", getAllPosts);

// get post by id
router.get("/:id", getPostById);

// create post
router.post("/", validator(createPostSchema), createPost);

// update post
router.patch("/:id", validator(updatePostSchema), updatePost);

// delete post
router.delete("/:id", deletePost);

module.exports = router;
