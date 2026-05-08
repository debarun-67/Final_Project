const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const blockchainRoutes = require('./routes/blockchain');
const authRoutes = require('./routes/auth');
const recordsRoutes = require('./routes/records');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', blockchainRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/records', recordsRoutes);

app.get('/', (req, res) => {
    res.send('Medical Blockchain API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
