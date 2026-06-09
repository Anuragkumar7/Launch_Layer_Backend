import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contactRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
              callback(null, true);
            } else {
              callback(null, false);
            }
          }
        : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '10kb' }));

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Launch Layer API is running',
    endpoints: { health: '/api/health', contact: 'POST /api/contact' },
  });
});

app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Launch Layer API is running' });
});

app.use('/api/contact', contactRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Launch Layer server running on port ${PORT}`);
});
