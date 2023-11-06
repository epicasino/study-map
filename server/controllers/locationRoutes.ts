import express from 'express';
import prisma from '../server';
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.query.id) {
    try {
      const locationId = req.query.id as string;

      // Aggregates all reviews and returns an average review score
      const averageRating = await prisma.review.aggregate({
        where: { locationId: parseInt(locationId) },
        _avg: { rating: true },
      });
      await prisma.location.update({
        where: { id: parseInt(locationId) },
        data: { rating: averageRating._avg.rating },
      });

      const location = await prisma.location.findFirst({
        where: { id: parseInt(locationId) },
      });
      if (!location) {
        return res.status(404).json({ message: '404: Not Found' });
      }

      return res.status(200).json(location);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
  const locations = await prisma.location.findMany({});
  return res.status(200).json(locations);
});

export default router;
