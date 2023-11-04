import express from 'express';
const router = express.Router();

router.post('/', async (req, res) => {
  res.json('Hi');
});

export default router;
