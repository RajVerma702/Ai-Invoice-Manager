const pool = require("../db");

// Create invoice item
const createInvoiceItem = async (
    invoice_id,
    description,
    quantity,
    price
) => {
    const amount = quantity * price;

    const result = await pool.query(
        `INSERT INTO invoice_items
        (invoice_id, description, quantity, price, amount)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            invoice_id,
            description,
            quantity,
            price,
            amount
        ]
    );

    return result.rows[0];
};


// Get all items for an invoice
const getItemsByInvoiceId = async (invoice_id) => {
    const result = await pool.query(
        `SELECT *
         FROM invoice_items
         WHERE invoice_id = $1
         ORDER BY id`,
        [invoice_id]
    );

    return result.rows;
};


// Get one invoice item
const getInvoiceItemById = async (id) => {
    const result = await pool.query(
        `SELECT *
         FROM invoice_items
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};


// Update invoice item
const updateInvoiceItem = async (
    id,
    description,
    quantity,
    price
) => {
    const amount = quantity * price;

    const result = await pool.query(
        `UPDATE invoice_items
         SET description = $1,
             quantity = $2,
             price = $3,
             amount = $4
         WHERE id = $5
         RETURNING *`,
        [
            description,
            quantity,
            price,
            amount,
            id
        ]
    );

    return result.rows[0];
};


// Delete invoice item
const deleteInvoiceItem = async (id) => {
    const result = await pool.query(
        `DELETE FROM invoice_items
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};


module.exports = {
    createInvoiceItem,
    getItemsByInvoiceId,
    getInvoiceItemById,
    updateInvoiceItem,
    deleteInvoiceItem
};