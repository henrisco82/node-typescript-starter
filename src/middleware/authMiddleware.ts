import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { type NextFunction, type Request, type Response } from 'express';
import { type UserDocument } from '../models/userModel';
import { findUserById } from '../services/user.service';

interface CustomRequest extends Request {
  user?: UserDocument | null;
}

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;
    const { authorization } = req.headers;

    if (authorization?.startsWith('Bearer') === true) {
      try {
        token = authorization?.substring(7, authorization.length);
        if (token === undefined) {
          res.status(401);
          throw new Error('Not authorized, no token');
        }
        const secret: string = process.env.JWT_SECRET ?? '';
        const decoded = jwt.verify(token, secret);
        const { id } = decoded as { id: string };

        const user = await findUserById(id);
        if (user === null) throw new Error('User not found');
        req.user = user;
        next();
      } catch (error) {
        console.error(error);
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    }
  },
);

const admin = (req: CustomRequest, res: Response, next: NextFunction): void => {
  if (req.user?.isAdmin === true) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
