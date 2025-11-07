
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
