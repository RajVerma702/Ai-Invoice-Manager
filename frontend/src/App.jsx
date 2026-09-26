import { useState } from "react";

function App() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(
        !!localStorage.getItem("token")
    );

    const [prompt, setPrompt] = useState("");
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Login
    const login = async () => {
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            localStorage.setItem("token", data.token);

            setLoggedIn(true);
            setMessage("Login successful!");

        } catch (error) {
            setMessage("Cannot connect to backend");
        }
    };

    // Create AI invoice
    const createInvoice = async () => {
        if (!prompt.trim()) {
            setMessage("Please enter an invoice request.");
            return;
        }

        setLoading(true);
        setMessage("");
        setInvoice(null);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/ai/invoice",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        prompt
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Failed to create invoice");
                return;
            }

            setInvoice(data.invoice);

        } catch (error) {
            setMessage("Cannot connect to backend");
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setLoggedIn(false);
        setInvoice(null);
        setMessage("");
    };

    // Login screen
    if (!loggedIn) {
        return (
            <div>
                <h1>AI Invoice Manager</h1>

                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button onClick={login}>
                    Login
                </button>

                {message && (
                    <p>{message}</p>
                )}
            </div>
        );
    }

    // AI Invoice screen
    return (
        <div>
            <h1>AI Invoice Manager</h1>

            <button onClick={logout}>
                Logout
            </button>

            <hr />

            <h2>Create Invoice with AI</h2>

            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Create an invoice for ABC Technologies for 5 keyboards at ₹2000 each, due in 30 days."
                rows="5"
                cols="60"
            />

            <br /><br />

            <button
                onClick={createInvoice}
                disabled={loading}
            >
                {loading
                    ? "Creating..."
                    : "Generate Invoice"}
            </button>

            {message && (
                <p>{message}</p>
            )}

            {invoice && (
                <div>
                    <hr />

                    <h2>Invoice Created</h2>

                    <p>
                        <strong>Invoice Number:</strong>{" "}
                        {invoice.invoice_number}
                    </p>

                    <p>
                        <strong>Customer:</strong>{" "}
                        {invoice.customer}
                    </p>

                    <h3>Items</h3>

                    {invoice.items.map((item, index) => (
                        <p key={index}>
                            {item.description} —{" "}
                            {item.quantity} × ₹{item.price}
                        </p>
                    ))}

                    <p>
                        <strong>Subtotal:</strong>{" "}
                        ₹{invoice.subtotal}
                    </p>

                    <p>
                        <strong>GST:</strong>{" "}
                        ₹{invoice.tax}
                    </p>

                    <p>
                        <strong>Total:</strong>{" "}
                        ₹{invoice.total}
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;