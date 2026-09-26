const {
    generateAIResponse
} = require("../services/geminiService");

const {
    createInvoice
} = require("../models/invoiceModel");

const {
    createInvoiceItem
} = require("../models/invoiceItemModel");

const {
    recalculateInvoiceTotals
} = require("../models/invoiceModel");

const pool = require("../db");


const createAIInvoice = async (req, res) => {
    try {

        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({
                message: "Prompt is required"
            });
        }

        // Ask Gemini to extract invoice information
        const aiPrompt = `
You are an invoice assistant.

Extract invoice information from the user's request.

Return ONLY valid JSON in this exact format:

{
    "customer_name": "",
    "items": [
        {
            "description": "",
            "quantity": 0,
            "price": 0
        }
    ],
    "due_days": 0
}

Rules:
- Do not add extra fields.
- quantity and price must be numbers.
- due_days must be a number.
- Do not calculate tax or total.
- If something is missing, use null.

User request:
${prompt}
`;

        const aiResponse = await generateAIResponse(aiPrompt);

        // Remove possible markdown formatting
        const cleanedResponse = aiResponse
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const invoiceData = JSON.parse(cleanedResponse);

        // Find customer
        const customerResult = await pool.query(
            `SELECT * FROM customers
             WHERE LOWER(name) = LOWER($1)`,
            [invoiceData.customer_name]
        );

        if (customerResult.rows.length === 0) {
            return res.status(404).json({
                message: "Customer not found. Please create the customer first."
            });
        }

        const customer = customerResult.rows[0];

        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`;

        // Calculate due date
        const invoiceDate = new Date();

        const dueDate = new Date();
        dueDate.setDate(
            dueDate.getDate() + invoiceData.due_days
        );

        // Create invoice
        const invoice = await createInvoice(
            customer.id,
            invoiceNumber,
            invoiceDate,
            dueDate,
            0,
            0,
            0,
            "Pending"
        );

        // Create invoice items
        for (const item of invoiceData.items) {

            await createInvoiceItem(
                invoice.id,
                item.description,
                item.quantity,
                item.price
            );
        }

        // Calculate subtotal, tax and total
        const totals = await recalculateInvoiceTotals(
            invoice.id
        );

        res.status(201).json({
            message: "AI invoice created successfully",
            invoice: {
                id: invoice.id,
                invoice_number: invoiceNumber,
                customer: customer.name,
                items: invoiceData.items,
                subtotal: totals.subtotal,
                tax: totals.tax,
                total: totals.total
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create AI invoice"
        });
    }
};


module.exports = {
    createAIInvoice
};