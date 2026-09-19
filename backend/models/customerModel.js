const pool = require("../db");

// Create customer
const createCustomer = async (name, email, phone, address) => {
    const result = await pool.query(
        `INSERT INTO customers (name, email, phone, address)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [name, email, phone, address]
    );

    return result.rows[0];
};

// Get all customers
const getAllCustomers = async () => {
    const result = await pool.query(
        `SELECT * FROM customers
         ORDER BY created_at DESC`
    );

    return result.rows;
};

// Get customer by ID
const getCustomerById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM customers
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

// Update customer
const updateCustomer = async (
    id,
    name,
    email,
    phone,
    address
) => {
    const result = await pool.query(
        `UPDATE customers
         SET name = $1,
             email = $2,
             phone = $3,
             address = $4
         WHERE id = $5
         RETURNING *`,
        [name, email, phone, address, id]
    );

    return result.rows[0];
};

// Delete customer
const deleteCustomer = async (id) => {
    const result = await pool.query(
        `DELETE FROM customers
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};

module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
};