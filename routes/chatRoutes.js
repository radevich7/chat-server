const cors = require("cors");
const express = require("express");
const { sseConnection, postPrompt } = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").get(sseConnection).post(cors(), postPrompt);

module.exports = router;
