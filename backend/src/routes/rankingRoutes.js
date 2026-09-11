const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const { ranking, history, daily, monthlyTime } = require("../controllers/rankingController");

router.get("/monthly-time/:groupId", verifyToken, monthlyTime); 
router.get("/history/:groupId", verifyToken, history);
router.get("/daily/:groupId", verifyToken, daily);
router.get("/:groupId", verifyToken, ranking);


module.exports = router;