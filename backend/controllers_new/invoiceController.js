const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} = require("../models/invoiceModel");


// Create invoice
const addInvoice = async (req, res) => {
    try {
        const {
            customer_id,
            invoice_number,
            invoice_date,
            due_date,
            subtotal,
            tax,
            total,
            status
        } = req.body;

        if (!customer_id || !invoice_number) {
            return res.status(400).json({
                message: "Customer ID and invoice number are required"
            });
        }

        const invoice = await createInvoice(
            customer_id,
            invoice_number,
            invoice_date,
            due_date,
            subtotal || 0,
            tax || 0,
            total || 0,
            status || "Pending"
        );

        res.status(201).json({
            message: "Invoice created successfully",
            invoice
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create invoice"
        });
    }
};


// Get all invoices
const getInvoices = async (req, res) => {
    try {
        const invoices = await getAllInvoices();

        res.status(200).json({
            invoices
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch invoices"
        });
    }
};


// Get invoice by ID
const getInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await getInvoiceById(id);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            invoice
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch invoice"
        });
    }
};


// Update invoice
const editInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            customer_id,
            invoice_date,
            due_date,
            subtotal,
            tax,
            total,
            status
        } = req.body;

        if (!customer_id) {
            return res.status(400).json({
                message: "Customer ID is required"
            });
        }

        const invoice = await updateInvoice(
            id,
            customer_id,
            invoice_date,
            due_date,
            subtotal || 0,
            tax || 0,
            total || 0,
            status || "Pending"
        );

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            message: "Invoice updated successfully",
            invoice
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update invoice"
        });
    }
};


// Delete invoice
const removeInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await deleteInvoice(id);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        res.status(200).json({
            message: "Invoice deleted successfully",
            invoice
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete invoice"
        });
    }
};


module.exports = {
    addInvoice,
    getInvoices,
    getInvoice,
    editInvoice,
    removeInvoice
};