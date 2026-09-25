import { Course } from '../models/Course.js';
import { initialCourses } from '../seeds/seedData.js';
import { getDBStatus } from '../config/db.js';

let demoCourses = [...initialCourses];

export const getCourses = async (req, res) => {
  try {
    if (getDBStatus()) {
      const courses = await Course.find();
      if (courses.length > 0) return res.json({ success: true, count: courses.length, data: courses });
    }
    return res.json({ success: true, count: demoCourses.length, data: demoCourses });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (getDBStatus()) {
      const course = await Course.findById(id);
      if (course) return res.json({ success: true, data: course });
    }
    const found = demoCourses.find((c) => c._id === id || c.code === id);
    if (found) return res.json({ success: true, data: found });
    return res.status(404).json({ success: false, message: 'Course not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    if (getDBStatus()) {
      const newCourse = await Course.create(courseData);
      return res.status(201).json({ success: true, message: 'Course created successfully', data: newCourse });
    }
    const newCourse = { ...courseData, _id: 'course-' + Date.now() };
    demoCourses.unshift(newCourse);
    return res.status(201).json({ success: true, message: 'Course created (Demo Mode)', data: newCourse });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkInAttendance = async (req, res) => {
  try {
    const { courseCode } = req.body;
    const course = demoCourses.find((c) => c.code === courseCode);
    if (course) {
      course.attendanceStats.attended += 1;
      course.attendanceStats.totalHeld += 1;
      return res.json({
        success: true,
        message: `Attendance marked for ${course.code} (${course.title})!`,
        stats: course.attendanceStats,
      });
    }
    return res.status(404).json({ success: false, message: 'Course not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
