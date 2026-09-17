const { createUser } = require("../models/userModel");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const user = await createUser(name, email, password);

        res.status(201).json({
            message: "User created successfully",
            user
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create user"
        });
    }
};

module.exports = {
    registerUser
};