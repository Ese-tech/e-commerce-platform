import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest } from '../types';

interface JwtPayload {
  userId: string;
  isAdmin: boolean;
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  console.log('=== AUTH MIDDLEWARE ===');
  console.log('Cookies:', req.cookies);
  
  const token = req.cookies?.token;
  
  if (!token) {
    console.log('No token found in cookies');
    res.status(401).json({ message: 'Not authorized - No token provided' });
    return;
  }
  
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log('JWT_SECRET not defined');
      throw new Error('JWT_SECRET is not defined');
    }
    
    console.log('Verifying token...');
    const decoded = jwt.verify(token, secret) as JwtPayload;
    console.log('Token verified, user:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
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