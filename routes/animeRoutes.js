const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { searchAnime } = require("../controllers/animeController");

router.get("/search", auth, searchAnime);

module.exports = router;
