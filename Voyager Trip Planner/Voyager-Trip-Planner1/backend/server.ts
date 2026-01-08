
import express from 'express';
import cors from 'cors';
import { fetchTripPlan } from './plannerService';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.post('/api/plan', async (req, res) => {
  try {
    const result = await fetchTripPlan(req.body);
    res.json(result);
  } catch (error: any) {
    console.error('Error in /api/plan:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Note: In this specific browser preview environment, 
// the server won't "run" but this demonstrates the requested architecture.
// The frontend calls the service logic directly to ensure the preview works.
console.log(`Server template initialized for port ${PORT}`);
