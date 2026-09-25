import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_campusos_jwt_key_2026_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      studentId: user.studentId,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Demo user fallbacks when DB is offline
const DEMO_STUDENT = {
  _id: '507f1f77bcf86cd799439011',
  name: 'Alex Chen',
  email: 'alex@campusos.edu',
  role: 'student',
  studentId: 'CP-892144',
  department: 'Computer Science & Engineering',
  year: 3,
  semester: 5,
  cgpa: 3.89,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  bio: 'Distributed Systems & Cyber Defense Researcher | CampusOS Alpha Tester',
};

const DEMO_ADMIN = {
  _id: '507f1f77bcf86cd799439012',
  name: 'Dr. Sarah Connor',
  email: 'admin@campusos.edu',
  role: 'admin',
  studentId: 'ADMIN-001',
  department: 'CampusOS Systems Administration',
  year: 4,
  semester: 8,
  cgpa: 4.0,
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
  bio: 'Head of CampusOS Operations & Dean of Digital Transformation',
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, department, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields.' });
    }

    if (getDBStatus()) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email address.' });
      }

      const user = await User.create({
        name,
        email,
        password,
        role: role === 'admin' ? 'admin' : 'student',
        department: department || 'Computer Science & Engineering',
        year: year || 1,
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to CampusOS.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          year: user.year,
          cgpa: user.cgpa,
          avatar: user.avatar,
        },
      });
    } else {
      // Demo mode registration
      const newUser = {
        _id: 'demo-' + Date.now(),
        name,
        email,
        role: role === 'admin' ? 'admin' : 'student',
        studentId: 'CP-' + Math.floor(100000 + Math.random() * 900000),
        department: department || 'Computer Science & Engineering',
        year: year || 1,
        cgpa: 3.85,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      };
      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful (Demo Mode). Welcome to CampusOS!',
        token,
        user: newUser,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    if (getDBStatus()) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password mismatch.' });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({ success: false, message: 'Account suspended. Contact campus administration.' });
      }

      const token = generateToken(user);

      return res.json({
        success: true,
        message: `Welcome back, ${user.name}!`,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
          department: user.department,
          year: user.year,
          cgpa: user.cgpa,
          avatar: user.avatar,
        },
      });
    } else {
      // Demo credentials fallback
      if (email.toLowerCase().includes('admin')) {
        const token = generateToken(DEMO_ADMIN);
        return res.json({
          success: true,
          message: 'Welcome back, Administrator! (Demo Mode)',
          token,
          user: DEMO_ADMIN,
        });
      } else {
        const token = generateToken(DEMO_STUDENT);
        return res.json({
          success: true,
          message: 'Welcome back, Alex! (Demo Mode)',
          token,
          user: DEMO_STUDENT,
        });
      }
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  try {
    return res.json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, department, avatar } = req.body;
    if (getDBStatus() && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (department) user.department = department;
        if (avatar) user.avatar = avatar;
        await user.save();
        return res.json({ success: true, message: 'Profile updated successfully', user });
      }
    }
    return res.json({
      success: true,
      message: 'Profile updated',
      user: { ...req.user, name: name || req.user.name, bio: bio || req.user.bio },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
