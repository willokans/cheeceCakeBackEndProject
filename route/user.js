const express = require("express");
const router = express.Router();
const {
  signup,
  signIn,
  logout,
  singleUser,
} = require("../controllers/userController");

router.post("/signup", signup);
router.post("/signIn", signIn);
router.get("/logout", logout);
router.get("/user/:id", singleUser);

module.exports = router;
