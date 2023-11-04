import jwt from 'jsonwebtoken';
const secret =
  '3dF27fhh9vIC9mta!vGQFa6VbQbhU?MpQFam6qdH/z3vvnU?HM1/NM=bh8LFdu/I';
const expiration = '2h';

export function authMiddleware({ req }: any) {
  let token = req.body.token || req.query.token || req.headers.authorization;

  // ["Bearer", "<tokenvalue>"]
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data }: any = jwt.verify(token, secret, { maxAge: expiration });
    req.user = data;
  } catch {
    console.log('Invalid token');
  }

  return req;
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
