const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const routes = require('./routes/api');
require('dotenv').config();

const app = express();

const port = process.env.PORT || 5000;

// Connect to the database
mongoose
    .connect(process.env.MONGO_DB_URI, { useNewUrlParser: true })
    .then(() => console.log(`Database connected successfully`))
    .catch((err) => console.log(err));

// Since mongoose's Promise is deprecated, we override it with Node's Promise
mongoose.Promise = global.Promise;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

app.use('/api', routes);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.name === 'ValidationError' ? 400 : 500;
    res.status(status).json({ error: err.message || 'Server error' });
});

// Serve static frontend (HTML/CSS/JS)
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to the main page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});