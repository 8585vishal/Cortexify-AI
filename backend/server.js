import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: false,
}));

app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', chatRouter);

app.listen(PORT, () => {
  console.log(`Cortexify Node backend listening on http://localhost:${PORT}`);
  console.log('ENABLE_DEV_FALLBACK =', process.env.ENABLE_DEV_FALLBACK);
});