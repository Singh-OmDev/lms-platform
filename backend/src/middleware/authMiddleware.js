import { getAuth, clerkClient } from '@clerk/express';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

export const authenticate = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'Authentication token missing or invalid' });
    }

    // 1. Fetch user details from Clerk backend
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    
    if (!email) {
      return res.status(400).json({ error: 'Clerk user has no valid email address' });
    }

    // 2. Query our SQLite database by email
    let user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    // 3. If the user doesn't exist in our DB, dynamically create a record
    if (!user) {
      const name = clerkUser.firstName 
        ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() 
        : email.split('@')[0];
        
      const dummyPassword = await bcrypt.hash(Math.random().toString(36), 10);
      
      const adminEmails = process.env.ADMIN_EMAILS
        ? process.env.ADMIN_EMAILS.split(',').map(e => e.trim().toLowerCase())
        : ['admin@lms.com'];
      
      const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'user';

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: dummyPassword,
          role
        }
      });

      user = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      };
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Clerk authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
};

export const optionalAuthenticate = async (req, res, next) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return next();
    }

    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;
    if (!email) {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    // Proceed without throwing if auth check fails on optional routes
    next();
  }
};

