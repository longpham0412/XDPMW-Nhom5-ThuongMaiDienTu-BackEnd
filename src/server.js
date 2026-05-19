const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const paymentRoutes = require('./routes/payment.routes');
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên port ${PORT}`);
});