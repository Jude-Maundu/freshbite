const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const { connectDatabase } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const menuRoutes = require('./routes/menuRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { bootstrapDatabase } = require('./seed/bootstrap');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const defaultAllowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
const renderPreviewOriginPattern = /^https:\/\/[a-z0-9-]+\.onrender\.com$/i;

function buildAllowedOrigins() {
  const envOrigins = [process.env.CLIENT_URL, process.env.CLIENT_URLS]
    .filter(Boolean)
    .flatMap((value) => String(value).split(','))
    .map((value) => value.trim())
    .filter(Boolean);

  return Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));
}

const allowedOrigins = buildAllowedOrigins();

function isAllowedOrigin(origin = '') {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.includes(origin)) {
    return true;
  }

  return renderPreviewOriginPattern.test(origin);
}

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS origin not allowed: ${origin}. Add it to CLIENT_URL or CLIENT_URLS.`
        )
      );
    },
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Fresh Bites API is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

const frontendBuildPath = path.join(__dirname, '..', 'fresh-bites', 'build');
if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  app.get(/^(?!\/api|\/uploads).*/, (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  await bootstrapDatabase();

  app.listen(PORT, () => {
    console.log(`Fresh Bites API listening on port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Failed to start Fresh Bites API', error);
  process.exit(1);
});
