const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { createPost, getMyPosts, updatePost, deletePost } = require("../controllers/postController");

router.post("/", auth, createPost);
router.get("/", auth, getMyPosts);
router.put("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

module.exports = router;
