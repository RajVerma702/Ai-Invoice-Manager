const pool = require("../db");

// Create invoice
const createInvoice = async (
    customer_id,
    invoice_number,
    invoice_date,
    due_date,
    subtotal,
    tax,
    total,
    status
) => {
    const result = await pool.query(
        `INSERT INTO invoices
        (
            customer_id,
            invoice_number,
            invoice_date,
            due_date,
            subtotal,
            tax,
            total,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            customer_id,
            invoice_number,
            invoice_date,
            due_date,
            subtotal,
            tax,
            total,
            status
        ]
    );

    return result.rows[0];
};


// Get all invoices
const getAllInvoices = async () => {
    const result = await pool.query(
        `SELECT invoices.*, customers.name AS customer_name
         FROM invoices
         LEFT JOIN customers
         ON invoices.customer_id = customers.id
         ORDER BY invoices.created_at DESC`
    );

    return result.rows;
};


// Get invoice by ID
const getInvoiceById = async (id) => {
    const result = await pool.query(
        `SELECT invoices.*, customers.name AS customer_name
         FROM invoices
         LEFT JOIN customers
         ON invoices.customer_id = customers.id
         WHERE invoices.id = $1`,
        [id]
    );

    return result.rows[0];
};


// Update invoice
const updateInvoice = async (
    id,
    customer_id,
    invoice_date,
    due_date,
    subtotal,
    tax,
    total,
    status
) => {
    const result = await pool.query(
        `UPDATE invoices
         SET customer_id = $1,
             invoice_date = $2,
             due_date = $3,
             subtotal = $4,
             tax = $5,
             total = $6,
             status = $7
         WHERE id = $8
         RETURNING *`,
        [
            customer_id,
            invoice_date,
            due_date,
            subtotal,
            tax,
            total,
            status,
            id
        ]
    );

    return result.rows[0];
};


// Delete invoice
const deleteInvoice = async (id) => {
    const result = await pool.query(
        `DELETE FROM invoices
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};
// Recalculate invoice totals from invoice items
const recalculateInvoiceTotals = async (invoiceId) => {
    const result = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) AS subtotal
         FROM invoice_items
         WHERE invoice_id = $1`,
        [invoiceId]
    );

    const subtotal = Number(result.rows[0].subtotal);

    // 18% GST
    const tax = subtotal * 0.18;

    const total = subtotal + tax;

    await pool.query(
        `UPDATE invoices
         SET subtotal = $1,
             tax = $2,
             total = $3
         WHERE id = $4`,
        [subtotal, tax, total, invoiceId]
    );

    return {
        subtotal,
        tax,
        total
    };
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
    recalculateInvoiceTotals
};