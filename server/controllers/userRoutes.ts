import prisma from '../server';
import express from 'express';
import bcrypt from 'bcrypt';
import { authMiddleware, signToken } from '../utils/auth';

const hashPass = (password: string) => {
  const passToHash = bcrypt.hashSync(password, 10);
  return passToHash;
};

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const password = hashPass(req.body.password);

    const registerUser = await prisma.user.create({
      data: {
        username: req.body.username,
        password,
        email: req.body.email,
        bio: req.body.bio,
      },
    });

    if (registerUser) {
      const token = signToken(registerUser);
      res.status(200).json({ token });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const token = signToken(user);
        return res.status(200).json({ token });
      }
    }
    return res.status(400).json({ message: 'Invalid username or password!' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/users', authMiddleware, async (req, res) => {
  const users = await prisma.user.findMany({ select: { username: true } });

  res.status(200).json(users);
});

export default router;
