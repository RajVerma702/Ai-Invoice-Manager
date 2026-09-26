const express = require("express");

const {
    addInvoiceItem,
    getInvoiceItems,
    getInvoiceItem,
    editInvoiceItem,
    removeInvoiceItem
} = require("../controllers_new/invoiceItemController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create invoice item
router.post("/", authMiddleware, addInvoiceItem);

// Get all items for an invoice
router.get("/invoice/:invoiceId", authMiddleware, getInvoiceItems);

// Get one invoice item
router.get("/:id", authMiddleware, getInvoiceItem);

// Update invoice item
router.put("/:id", authMiddleware, editInvoiceItem);

// Delete invoice item
router.delete("/:id", authMiddleware, removeInvoiceItem);

module.exports = router;