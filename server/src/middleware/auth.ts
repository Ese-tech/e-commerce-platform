import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

interface JwtPayload {
  userId: string;
  isAdmin: boolean;
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;
  
  if (!token) {
    res.status(401).json({ message: 'Not authorized - No token provided' });
    return;
  }
  
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized - Invalid token' });
  }
};

export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};