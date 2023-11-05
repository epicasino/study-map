import express from 'express';
import prisma from '../server';
import { authMiddleware } from '../utils/auth';
const router = express.Router();

router.post('/create', authMiddleware, async (req: any, res) => {
  try {
    let locationOfReview = await prisma.location.findFirst({
      where: {
        address: req.body.address,
      },
    });
    if (!locationOfReview) {
      locationOfReview = await prisma.location.create({
        data: {
          placeName: req.body.placeName,
          address: req.body.address,
        },
      });
    }
    const createdReview = await prisma.review.create({
      data: {
        rating: req.body.rating,
        title: req.body.title,
        review: req.body.review,
        userId: req.user.data.id,
        locationId: locationOfReview.id,
      },
    });
    res.status(200).json(createdReview);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

export default router;
