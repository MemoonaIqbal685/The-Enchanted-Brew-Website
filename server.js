const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// --- DATABASE CONNECTION (Optimized for Timeouts) ---
// Maine connection string mein timeout settings aur wait time barha diya hai
const dbURI = "mongodb+srv://Moona12:HarryHarry@enchantedcluster.mzkfdv2.mongodb.net/EnchantedBrew?retryWrites=true&w=majority&appName=EnchantedCluster";

mongoose.connect(dbURI, {
    serverSelectionTimeoutMS: 30000, // 30 seconds tak server dhoondne ka wait karega
    socketTimeoutMS: 45000,         // Socket connection ke liye 45 seconds
})
.then(() => console.log("Magical Database Connected! 🪄✨"))
.catch(err => {
    // Agar dobara timeout aaye to yahan saaf error nazar aayega
    console.log("Dark Magic Error (Connection Failed):", err.message);
});

// --- SCHEMAS & MODELS ---

const Review = mongoose.model('Review', new mongoose.Schema({
    name: String,
    message: String,
    date: { type: Date, default: Date.now }
}));

const Contact = mongoose.model('Contact', new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
}));

const Order = mongoose.model('Order', new mongoose.Schema({
    customer: String,
    brew: String,
    quantity: Number,
    address: String,
    date: { type: Date, default: Date.now }
}));


// --- ROUTES / APIs ---

// 🔮 Order API
app.post('/api/order', async (req, res) => {
    console.log("Order signal received at the owl tower...");
    try {
        const { customer, brew, quantity, address } = req.body;
        
        if (!customer || !brew || !address) {
            return res.status(400).json({ message: "Incomplete order details!" });
        }

        const newOrder = new Order({ customer, brew, quantity, address });
        await newOrder.save();
        
        console.log("🦉 Order safely inscribed in the Atlas scrolls!");
        res.status(200).json({ success: true, message: "Order Saved!" });
    } catch (err) {
        console.log("Order Save Error:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// 🦉 Contact API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Fields missing!" });
        }
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ success: true, message: "Owl delivered the post." });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ✨ Review API
app.post('/api/reviews', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) { 
        res.status(500).json({ error: err.message }); 
    }
});

app.get('/api/reviews', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ date: -1 });
        res.json(reviews);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/', (req, res) => res.send("Oracle Server is Online! 🔮"));

// --- START SERVER ---
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Owl Post Server flying on Port ${PORT} 🦉`);
});