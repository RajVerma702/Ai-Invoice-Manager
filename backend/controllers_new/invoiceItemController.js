const {
    createInvoiceItem,
    getItemsByInvoiceId,
    getInvoiceItemById,
    updateInvoiceItem,
    deleteInvoiceItem
} = require("../models/invoiceItemModel");

const {
    recalculateInvoiceTotals
} = require("../models/invoiceModel");


// Create invoice item
const addInvoiceItem = async (req, res) => {
    try {
        const {
            invoice_id,
            description,
            quantity,
            price
        } = req.body;

        if (!invoice_id || !description || !quantity || price === undefined) {
            return res.status(400).json({
                message: "Invoice ID, description, quantity and price are required"
            });
        }

        const item = await createInvoiceItem(
            invoice_id,
            description,
            quantity,
            price
        );

        // Recalculate invoice totals
        await recalculateInvoiceTotals(invoice_id);

        res.status(201).json({
            message: "Invoice item created successfully",
            item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create invoice item"
        });
    }
};


// Get all items for an invoice
const getInvoiceItems = async (req, res) => {
    try {
        const { invoiceId } = req.params;

        const items = await getItemsByInvoiceId(invoiceId);

        res.status(200).json({
            items
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch invoice items"
        });
    }
};


// Get one invoice item
const getInvoiceItem = async (req, res) => {
    try {
        const { id } = req.params;

        const item = await getInvoiceItemById(id);

        if (!item) {
            return res.status(404).json({
                message: "Invoice item not found"
            });
        }

        res.status(200).json({
            item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch invoice item"
        });
    }
};


// Update invoice item
const editInvoiceItem = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            description,
            quantity,
            price
        } = req.body;

        if (!description || !quantity || price === undefined) {
            return res.status(400).json({
                message: "Description, quantity and price are required"
            });
        }

        const item = await updateInvoiceItem(
            id,
            description,
            quantity,
            price
        );

        if (!item) {
            return res.status(404).json({
                message: "Invoice item not found"
            });
        }

        // Recalculate invoice totals
        await recalculateInvoiceTotals(item.invoice_id);

        res.status(200).json({
            message: "Invoice item updated successfully",
            item
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update invoice item"
        });
    }
};


// Delete invoice item
const removeInvoiceItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Get item first so we know its invoice_id
        const item = await getInvoiceItemById(id);

        if (!item) {
            return res.status(404).json({
                message: "Invoice item not found"
            });
        }

        const deletedItem = await deleteInvoiceItem(id);

        // Recalculate invoice totals
        await recalculateInvoiceTotals(item.invoice_id);

        res.status(200).json({
            message: "Invoice item deleted successfully",
            item: deletedItem
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete invoice item"
        });
    }
};


module.exports = {
    addInvoiceItem,
    getInvoiceItems,
    getInvoiceItem,
    editInvoiceItem,
    removeInvoiceItem
};