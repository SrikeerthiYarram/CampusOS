import jwt from 'jsonwebtoken';
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

    // If DB is connected, fetch fresh user record from Mongo
    if (getDBStatus()) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists.',
        });
      }
      req.user = user;
    } else {
      // Mock/demo user context when running without DB setup
      req.user = {
        _id: decoded.id || 'demo-user-id',
        name: decoded.name || 'Alex Chen',
        email: decoded.email || 'alex@campusos.edu',
        role: decoded.role || 'student',
        studentId: decoded.studentId || 'CP-892144',
        department: 'Computer Science & Engineering',
        year: 3,
        semester: 5,
        cgpa: 3.89,
      };
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};
