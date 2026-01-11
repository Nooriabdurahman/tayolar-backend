const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const serviceRoutes = require('./routes/services');
const jobRoutes = require('./routes/jobs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/jobs', jobRoutes);

app.get('/', (req, res) => {
  res.send('Tailor Marketplace API is running');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
