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
      res.status(200).json({ registerUser, token });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

export default router;
