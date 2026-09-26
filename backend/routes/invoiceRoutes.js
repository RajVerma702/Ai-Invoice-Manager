const express = require("express");

const {
    addInvoice,
    getInvoices,
    getInvoice,
    editInvoice,
    removeInvoice
} = require("../controllers_new/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create invoice
router.post("/", authMiddleware, addInvoice);

// Get all invoices
router.get("/", authMiddleware, getInvoices);

// Get invoice by ID
router.get("/:id", authMiddleware, getInvoice);

// Update invoice
router.put("/:id", authMiddleware, editInvoice);

// Delete invoice
router.delete("/:id", authMiddleware, removeInvoice);

module.exports = router;    