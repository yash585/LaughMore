const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serves static files

const razorpay = new Razorpay({
  key_id: "rzp_test_mXVIiQX7HTf7nd",
  key_secret: "B3Q5MAUgfJ1hCntKJ8452QF4"
});

// Store mapping from order ID to video filename
const orderVideoMap = new Map();

app.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount,
    currency: "INR",
    receipt: "receipt_order_" + Date.now()
  };

  try {
    const order = await razorpay.orders.create(options);
    
    // Select a random video for this order
    const videos = ["video1.mp4", "video2.mp4", "video3.mp4"];
    const selectedVideo = videos[Math.floor(Math.random() * videos.length)];
    
    // Save video mapped to order ID
    orderVideoMap.set(order.id, selectedVideo);

    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/get-video', (req, res) => {
  const { order_id } = req.query;
  const video = orderVideoMap.get(order_id);
  if (video) {
    res.json({ video });
  } else {
    res.status(404).json({ error: "Video not found for this order." });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));

