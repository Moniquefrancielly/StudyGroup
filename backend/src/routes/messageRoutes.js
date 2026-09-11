const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddlewares");
const { create, list, vote, remove } = require("../controllers/messageController");

router.post("/create", verifyToken, create);
router.get("/:groupId", verifyToken, list);
router.post("/:messageId/vote", verifyToken, vote);
router.delete("/:messageId", verifyToken, remove);

module.exports = router;