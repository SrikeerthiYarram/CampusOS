import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_campusos_jwt_key_2026_change_in_production';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authentication token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // If DB is connected and decoded ID is a valid ObjectId, fetch fresh record
    if (getDBStatus() && decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }

    // Fallback if DB is disconnected or demo/mock user session
    req.user = {
      _id: decoded.id || '507f1f77bcf86cd799439011',
      id: decoded.id || '507f1f77bcf86cd799439011',
      name: decoded.name || 'Alex Chen',
      email: decoded.email || 'alex@campusos.edu',
      role: decoded.role || 'student',
      studentId: decoded.studentId || 'CP-892144',
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 5,
      cgpa: 3.89,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};
