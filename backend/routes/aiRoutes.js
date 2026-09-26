const express = require("express");

const {
    createAIInvoice
} = require("../controllers_new/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/invoice",
    authMiddleware,
    createAIInvoice
);

module.exports = router;