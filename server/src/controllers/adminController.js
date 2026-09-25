import { User } from '../models/User.js';
import { getDBStatus } from '../config/db.js';

let demoUsersList = [
  {
    _id: 'usr-1',
    name: 'Dr. Sarah Connor',
    email: 'admin@campusos.edu',
    role: 'admin',
    studentId: 'ADMIN-001',
    department: 'CampusOS Systems Administration',
    status: 'active',
    cgpa: 4.0,
    year: 4,
    createdAt: '2026-01-10',
  },
  {
    _id: 'usr-2',
    name: 'Alex Chen',
    email: 'alex@campusos.edu',
    role: 'student',
    studentId: 'CP-892144',
    department: 'Computer Science & Engineering',
    status: 'active',
    cgpa: 3.89,
    year: 3,
    createdAt: '2026-02-14',
  },
  {
    _id: 'usr-3',
    name: 'Priya Sharma',
    email: 'priya@campusos.edu',
    role: 'student',
    studentId: 'CP-892150',
    department: 'Artificial Intelligence',
    status: 'active',
    cgpa: 3.94,
    year: 3,
    createdAt: '2026-02-15',
  },
  {
    _id: 'usr-4',
    name: 'Marcus Vance',
    email: 'marcus@campusos.edu',
    role: 'student',
    studentId: 'CP-892198',
    department: 'Cybersecurity',
    status: 'active',
    cgpa: 3.72,
    year: 2,
    createdAt: '2026-03-01',
  },
  {
    _id: 'usr-5',
    name: 'Elena Rostova',
    email: 'elena@campusos.edu',
    role: 'admin',
    studentId: 'FAC-044',
    department: 'Human-Computer Interaction',
    status: 'active',
    cgpa: 4.0,
    year: 4,
    createdAt: '2026-01-05',
  },
];

export const getAdminMetrics = async (req, res) => {
  try {
    const isDbConnected = getDBStatus();
    let totalStudents = demoUsersList.filter((u) => u.role === 'student').length;
    let totalAdmins = demoUsersList.filter((u) => u.role === 'admin').length;

    if (isDbConnected) {
      try {
        const studentCount = await User.countDocuments({ role: 'student' });
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (studentCount > 0) totalStudents = studentCount;
        if (adminCount > 0) totalAdmins = adminCount;
      } catch (e) {
        // Fallback to demo count
      }
    }

    return res.json({
      success: true,
      metrics: {
        totalStudents,
        totalAdmins,
        activeCourses: 14,
        upcomingEvents: 6,
        hackathonsActive: 2,
        activeInternships: 8,
        clubsRegistered: 12,
        systemUptime: '99.98%',
        databaseConnected: isDbConnected,
        activeSessions: 342,
        serverLatencyMs: 18,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    if (getDBStatus()) {
      const users = await User.find().select('-password');
      if (users.length > 0) return res.json({ success: true, count: users.length, data: users });
    }
    return res.json({ success: true, count: demoUsersList.length, data: demoUsersList });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, status } = req.body;

    if (getDBStatus()) {
      const user = await User.findById(id);
      if (user) {
        if (role) user.role = role;
        if (status) user.status = status;
        await user.save();
        return res.json({ success: true, message: `User privileges updated`, user });
      }
    }

    const user = demoUsersList.find((u) => u._id === id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (role) user.role = role;
    if (status) user.status = status;

    return res.json({ success: true, message: `User ${user.name} privileges updated!`, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
