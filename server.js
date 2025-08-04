
const express = require('express');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/videos/files', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
