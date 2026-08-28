const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env or local .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config();

const connectDB = require('./config/db');
const seedAdminAndDepartments = require('./utils/seedAdmin');

const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();

// Connect Database & Run Seed
connectDB().then(() => {
  seedAdminAndDepartments();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({
    status: 'Active',
    system: 'Smart Civic Issue Reporting System API',
    version: '1.0.0',
    mongodb: 'Connected',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[Global Error Handler]:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server Running]: http://localhost:${PORT}`);
});
