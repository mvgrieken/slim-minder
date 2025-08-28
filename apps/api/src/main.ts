import express from 'express';
import cors from 'cors';
import { config } from './config';
import { registerRoutes } from './routes';
import { authMiddleware } from './auth';

const app = express();
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

app.get('/', (_req, res) => {
  res.json({ name: 'Slim Minder API', env: config.env });
});

registerRoutes(app);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
