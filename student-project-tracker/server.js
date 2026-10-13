import express from 'express';
import { createApp } from './app.js';
import { db } from './database.js';

const app = createApp(db);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 3000);

app.listen(port, () => console.log(`Open http://localhost:${port}`));