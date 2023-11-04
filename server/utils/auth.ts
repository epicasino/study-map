import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secret =
  '3dF27fhh9vIC9mta!vGQFa6VbQbhU?MpQFam6qdH/z3vvnU?HM1/NM=bh8LFdu/I';
const expiration = '2h';

// Maybe work out type for req res in authMiddleware function
export function authMiddleware(req: any, res: any, next: NextFunction) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (token) {
    if (req.headers.authorization) {
      // ["Bearer", "<tokenvalue>"]
      token = token.split(' ').pop().trim();
    }
    jwt.verify(token, secret, { maxAge: expiration }, (err, user) => {
      if (err) {
        return res.status(403).status({ message: 'Error 403: Token Invalid' });
      }

      req.user = user;
      next();
    });
  } else {
    return res.status(401).json({ message: 'No Token!' });
  }
}

export function signToken({
  username,
  email,
  id,
}: {
  username: string;
  email: string;
  id: number;
}) {
  const payload = { username, email, id };

  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
}
