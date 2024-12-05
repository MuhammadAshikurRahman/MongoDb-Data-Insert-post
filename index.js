const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

// MongoDB URI এবং ক্লায়েন্ট
const uri = "mongodb+srv://mdashikurrahman50000:uel4Zcf5Rkj1DtU9@cluster0.dasvi.mongodb.net/VegitableShop?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// Express অ্যাপ্লিকেশন সেটআপ
const app = express();
app.use(express.json()); // JSON প্যার্সিং এর জন্য express.json() ব্যবহার করা হচ্ছে
app.use(bodyParser.urlencoded({ extended: true })); // ফর্ম URL-encoded ডেটা প্যার্স করার জন্য

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});  

 

async function start() {
    try {
        // MongoDB কানেকশন
        await client.connect();
        console.log("Connected to MongoDB!");

        const productCollection = client.db("VegitableShop").collection("Product");

        // POST রুট: Product অ্যাড করার জন্য
        app.post('/addProduct', async (req, res) => {
            const product = req.body;
            // try-catch এরর হ্যান্ডল করে।
            try {
                // Product ইনসার্ট করা
                const result = await productCollection.insertOne(product);
                console.log("Product added:", result);
                res.redirect('/'); // সফল ইনসার্ট হলে রিডাইরেক্ট
            } catch (err) {
                console.error("Error adding product:", err);
                res.status(500).send("Error adding product.");
            }
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
    }
}

// সার্ভার চালু করা
app.listen(process.env.PORT || 1000, () => {
    console.log("Server running on port 1000");
    start(); // MongoDB কানেকশন শুরু করা
});

