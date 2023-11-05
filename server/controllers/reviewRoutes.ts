import express from 'express';
import prisma from '../server';
import { authMiddleware } from '../utils/auth';
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (req.query.id) {
      const queryArgs = req.query.id as string;
      const review = await prisma.review.findFirst({
        where: { id: parseInt(queryArgs) },
      });

      if (!review) {
        return res.status(404).json({ message: 'Review not found!' });
      }
      return res.status(200).json(review);
    }
    const reviews = await prisma.review.findMany();
    res.status(200).json(reviews);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

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

router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const updatedReview = await prisma.review.update({
      where: { id: parseInt(req.params.id) },
      data: {
        rating: req.body.rating,
        title: req.body.title,
        review: req.body.review,
      },
    });
    res.status(200).json(updatedReview);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const deletedReview = await prisma.review.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.status(200).json(deletedReview);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

export default router;
