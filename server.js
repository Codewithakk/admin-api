const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const roleRoutes = require('./src/routes/role.routes');
const permissionRoutes = require('./src/routes/permission.routes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');
const connectDB = require('./src/config/database');
const seedDatabase = require('./src/utils/seedDatabase');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const app = express();
connectDB();
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing form data
// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 4000;

seedDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});

module.exports = app;