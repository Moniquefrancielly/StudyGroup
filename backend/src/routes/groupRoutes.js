const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/authMiddlewares");
const { isAdmin } = require("../middlewares/roleMiddlewares");

const {
  create, join, leave, remove, transfer,
  invite, joinViaInvite, updateGroup, listMembers,
  approve, reject, removeGroup, myGroups, listRequests
} = require("../controllers/groupController");

router.post("/create", verifyToken, create);
router.post("/join", verifyToken, join);
router.post("/leave", verifyToken, leave);
router.delete("/remove-user", verifyToken, isAdmin, remove);
router.post("/transfer-admin", verifyToken, isAdmin, transfer);
router.post("/invite", verifyToken, invite);
router.post("/join-invite", verifyToken, joinViaInvite);
router.put("/update", verifyToken, isAdmin, updateGroup);
router.get("/:groupId/members", verifyToken, listMembers);
router.post("/approve-request", verifyToken, isAdmin, approve);
router.post("/reject-request", verifyToken, isAdmin, reject);
router.post("/delete-group", verifyToken, removeGroup);
router.get("/my-groups", verifyToken, myGroups);
router.get("/:groupId/requests", verifyToken, listRequests);

module.exports = router;