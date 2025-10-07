const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const router = Router();
// /users
// get all users
router.get("/", getAllUsers);

// get user by id
router.get("/:id", getUserById);

// create user
router.post("/", createUser);

router.patch("/:id", updateUser);

// delete user
router.delete("/:id", deleteUser);

module.exports = router;
