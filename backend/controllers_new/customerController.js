const {
    createCustomer,
    getAllCustomers,
    getCustomerById,
    updateCustomer,
    deleteCustomer
} = require("../models/customerModel");

// Create customer
const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const customer = await createCustomer(
            name,
            email,
            phone,
            address
        );

        res.status(201).json({
            message: "Customer created successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create customer"
        });
    }
};


// Get all customers
const getCustomers = async (req, res) => {
    try {
        const customers = await getAllCustomers();

        res.status(200).json({
            customers
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customers"
        });
    }
};


// Get customer by ID
const getCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch customer"
        });
    }
};


// Update customer
const editCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Customer name is required"
            });
        }

        const customer = await updateCustomer(
            id,
            name,
            email,
            phone,
            address
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer updated successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update customer"
        });
    }
};


// Delete customer
const removeCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await deleteCustomer(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully",
            customer
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to delete customer"
        });
    }
};


module.exports = {
    addCustomer,
    getCustomers,
    getCustomer,
    editCustomer,
    removeCustomer
};