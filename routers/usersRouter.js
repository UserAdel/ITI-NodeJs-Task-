const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const validator = require("../middlewares/validator");
const { createUserSchema, updateUserSchema } = require("../utils/schemas");

const router = Router();
// /users
// get all users
router.get("/", getAllUsers);

// get user by id
router.get("/:id", getUserById);

// create user
router.post("/", validator(createUserSchema), createUser);

router.patch("/:id", validator(updateUserSchema), updateUser);

// delete user
router.delete("/:id", deleteUser);

module.exports = router;
