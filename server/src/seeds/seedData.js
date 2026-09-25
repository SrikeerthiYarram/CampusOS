import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Event } from '../models/Event.js';
import { Hackathon } from '../models/Hackathon.js';
import { Internship } from '../models/Internship.js';
import { Club } from '../models/Club.js';
import { Announcement } from '../models/Announcement.js';
import { Resource } from '../models/Resource.js';
import { Notification } from '../models/Notification.js';

dotenv.config();

export const initialCourses = [
  {
    code: 'CS-401',
    title: 'Distributed Systems & Cloud Architecture',
    department: 'Computer Science',
    credits: 4,
    semester: 5,
    instructor: {
      name: 'Dr. Aris Thorne',
      email: 'a.thorne@campusos.edu',
      office: 'Tech Tower 4B-12',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
    },
    schedule: [
      { day: 'Monday', time: '09:00 AM - 10:30 AM', room: 'Cyber Hall Alpha' },
      { day: 'Wednesday', time: '09:00 AM - 10:30 AM', room: 'Cyber Hall Alpha' },
      { day: 'Friday', time: '02:00 PM - 04:00 PM', room: 'Distributed Systems Lab 3' },
    ],
    attendanceStats: { totalHeld: 24, attended: 22 },
    syllabus: [
      { week: 1, topic: 'Consensus Algorithms (Raft & Paxos)', status: 'completed' },
      { week: 2, topic: 'Vector Clocks & Distributed State', status: 'completed' },
      { week: 3, topic: 'gRPC & High-Throughput Microservices', status: 'completed' },
      { week: 4, topic: 'Fault Tolerance & Chaos Engineering', status: 'in_progress' },
      { week: 5, topic: 'Event Streaming & Kafka Internals', status: 'upcoming' },
    ],
    color: 'from-cyan-500/20 to-blue-600/20',
    description: 'Deep dive into decentralized consensus, event streams, microservice orchestration, and fault-tolerant cloud infrastructures.',
  },
  {
    code: 'CS-415',
    title: 'Neural Networks & Deep Generative AI',
    department: 'Artificial Intelligence',
    credits: 4,
    semester: 5,
    instructor: {
      name: 'Prof. Maya Lin',
      email: 'm.lin@campusos.edu',
      office: 'AI Pavilion 201',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=128',
    },
    schedule: [
      { day: 'Tuesday', time: '11:00 AM - 12:30 PM', room: 'Quantum Hall 2' },
      { day: 'Thursday', time: '11:00 AM - 12:30 PM', room: 'Quantum Hall 2' },
    ],
    attendanceStats: { totalHeld: 20, attended: 19 },
    syllabus: [
      { week: 1, topic: 'Backpropagation & Computational Graphs', status: 'completed' },
      { week: 2, topic: 'Transformer Architecture & Self-Attention', status: 'completed' },
      { week: 3, topic: 'Diffusion Models & Latent Spaces', status: 'in_progress' },
      { week: 4, topic: 'RLHF & Alignment Strategies', status: 'upcoming' },
    ],
    color: 'from-purple-500/20 to-indigo-600/20',
    description: 'Foundations and state-of-the-art architectures in generative modeling, multimodal transformers, and neural scaling.',
  },
  {
    code: 'CS-320',
    title: 'Cyber Defense & Zero-Trust Cryptography',
    department: 'Cybersecurity',
    credits: 3,
    semester: 5,
    instructor: {
      name: 'Cmdr. Vance Sterling',
      email: 'v.sterling@campusos.edu',
      office: 'SecOps Bunker B',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    },
    schedule: [
      { day: 'Monday', time: '01:00 PM - 02:30 PM', room: 'SecOps Lab 1' },
      { day: 'Wednesday', time: '01:00 PM - 02:30 PM', room: 'SecOps Lab 1' },
    ],
    attendanceStats: { totalHeld: 22, attended: 21 },
    syllabus: [
      { week: 1, topic: 'Elliptic Curve Cryptography & Post-Quantum Prep', status: 'completed' },
      { week: 2, topic: 'Zero-Knowledge Proofs (ZK-SNARKs)', status: 'in_progress' },
      { week: 3, topic: 'Kernel Sandboxing & Memory Safety in Rust', status: 'upcoming' },
    ],
    color: 'from-emerald-500/20 to-teal-600/20',
    description: 'Modern cryptographic primitives, zero-knowledge proofs, defensive systems engineering, and zero-trust identity.',
  },
  {
    code: 'CS-388',
    title: 'Spatial Computing & 3D Web Graphics',
    department: 'Human-Computer Interaction',
    credits: 3,
    semester: 5,
    instructor: {
      name: 'Elena Rostova',
      email: 'e.rostova@campusos.edu',
      office: 'XR Studio 104',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=128',
    },
    schedule: [
      { day: 'Tuesday', time: '03:00 PM - 04:30 PM', room: 'Virtual Reality Hub' },
      { day: 'Thursday', time: '03:00 PM - 04:30 PM', room: 'Virtual Reality Hub' },
    ],
    attendanceStats: { totalHeld: 18, attended: 17 },
    syllabus: [
      { week: 1, topic: 'WebGL Pipeline, Shaders & GLSL', status: 'completed' },
      { week: 2, topic: 'Three.js & React Three Fiber Architectures', status: 'completed' },
      { week: 3, topic: 'Spatial UI & Dynamic Lighting', status: 'in_progress' },
    ],
    color: 'from-pink-500/20 to-rose-600/20',
    description: 'Crafting immersive interactive WebGL experiences, GPU fragment shaders, spatial interfaces, and 3D design systems.',
  },
];

export const initialEvents = [
  {
    title: 'Nexus Horizon: Campus Autonomous Tech Summit 2026',
    description: 'Keynotes from world-leading robotics and AI engineers exploring autonomous campus navigation, swarm drones, and cyber-physical infrastructure.',
    category: 'Symposium',
    date: '2026-10-18',
    time: '10:00 AM - 05:00 PM',
    venue: 'Main Grand Auditorium & Virtual Hologram Stage',
    organizer: 'Robotics & AI Guild',
    bannerUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000',
    capacity: 450,
    tags: ['AI', 'Robotics', 'Keynote', 'Hardware'],
    featured: true,
    status: 'upcoming',
  },
  {
    title: 'CyberSphere CTF 2026: Quantum Defense Battle',
    description: 'Compete in a 24-hour red team vs blue team capture the flag competition. Reverse engineering, binary exploitation, and post-quantum cryptographic vaults.',
    category: 'Hackathon',
    date: '2026-10-25',
    time: '06:00 PM - Next Day 06:00 PM',
    venue: 'Cyber Security Operations Center, Level -1',
    organizer: 'ZeroDay Club',
    bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    capacity: 150,
    tags: ['Cybersecurity', 'CTF', 'Prizes', 'Reverse Engineering'],
    featured: true,
    status: 'upcoming',
  },
  {
    title: 'Generative AI Workshop: Fine-tuning LLMs Locally',
    description: 'Hands-on workshop on quantizing and fine-tuning open-weights models (LLaMA-3, Mistral) on Apple Silicon and NVIDIA RTX clusters.',
    category: 'Workshop',
    date: '2026-10-08',
    time: '04:00 PM - 07:00 PM',
    venue: 'AI Lab 302 & Discord Stream',
    organizer: 'NeuroTech Society',
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000',
    capacity: 90,
    tags: ['GenAI', 'PyTorch', 'Hands-on', 'Workshop'],
    featured: false,
    status: 'upcoming',
  },
  {
    title: 'Aurora Spatial Tech & Creative Gala',
    description: 'Showcasing student-built interactive 3D generative art installations, kinetic light sculptures, and electronic ambient soundscapes.',
    category: 'Cultural',
    date: '2026-11-05',
    time: '07:00 PM - 11:00 PM',
    venue: 'Campus Open Plaza & Atrium Glass Dome',
    organizer: 'Design & Spatial Computing Collective',
    bannerUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000',
    capacity: 600,
    tags: ['Design', 'Art', 'XR', 'Music'],
    featured: false,
    status: 'upcoming',
  },
];

export const initialHackathons = [
  {
    title: 'CampusOS Global Hackathon 2026',
    theme: 'Decentralized Intelligence & Autonomous Campus Systems',
    description: 'Build futuristic solutions that re-imagine how universities operate. From real-time autonomous student agents to zero-knowledge academic credentials.',
    prizePool: '$25,000 + $50k Cloud Compute Credits',
    startDate: '2026-11-12',
    endDate: '2026-11-15',
    registrationDeadline: '2026-11-05',
    teamSizeMax: 4,
    teamSizeMin: 2,
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000',
    location: 'Campus Tech Hall & Discord Metaverse',
    tracks: [
      'Autonomous Campus Agents (AI)',
      'Decentralized Identity & ZK Credentials',
      'Spatial 3D Digital Twin of Campus',
      'Sustainable Micro-Grid & Smart Energy',
    ],
    rules: [
      'Fresh codebase written during the hackathon period',
      'Open-source repository on GitHub with MIT or Apache 2 license',
      'Working demo video (under 3 minutes) required for submission',
    ],
    status: 'registration_open',
  },
  {
    title: 'BioSync Neural Hack 2026',
    theme: 'Brain-Computer Interfaces & Assistive Spatial Tech',
    description: 'Harness consumer EEG devices and spatial headsets to create breakthrough assistive interfaces for students with physical disabilities.',
    prizePool: '$15,000 + Hardware Kits',
    startDate: '2026-12-01',
    endDate: '2026-12-03',
    registrationDeadline: '2026-11-20',
    teamSizeMax: 3,
    teamSizeMin: 1,
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1000',
    location: 'Biomedical Engineering Pavilion',
    tracks: ['EEG Signal Processing', 'Eye-Tracking Spatial Navigation', 'Haptic Feedback Controllers'],
    rules: ['All hardware libraries must be documented', 'Peer safety verification prior to live demo'],
    status: 'registration_open',
  },
];

export const initialInternships = [
  {
    title: 'Autonomous Systems & Robotics Intern',
    company: 'Voxel Dynamics Labs',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    location: 'San Francisco, CA (or Remote)',
    workplaceType: 'Hybrid',
    type: 'Summer Internship',
    stipend: '$52 / hour + Housing Stipend',
    deadline: '2026-10-31',
    description: 'Join our perception team working on real-time SLAM, LiDAR point-cloud processing, and spatial scene graphs for quadrupeds and indoor delivery bots.',
    requirements: [
      'Pursuing BS/MS in Computer Science, Robotics, or Electrical Engineering',
      'Proficiency in C++20 and Python',
      'Familiarity with ROS2, OpenCV, or PyTorch3D',
    ],
    skills: ['C++', 'Python', 'ROS2', 'Computer Vision', 'PyTorch'],
    applyUrl: 'https://careers.example.com/voxel-dynamics',
    status: 'active',
  },
  {
    title: 'Distributed Infrastructure & Cloud Engineer',
    company: 'CloudMatrix Technologies',
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=128',
    location: 'Seattle, WA (Remote Available)',
    workplaceType: 'Remote',
    type: 'Summer Internship',
    stipend: '$48 / hour',
    deadline: '2026-11-15',
    description: 'Architect multi-region Kubernetes clusters, develop eBPF observability probes, and optimize latency for billion-request workloads.',
    requirements: [
      'Strong understanding of Linux networking, TCP/IP, and kernel primitives',
      'Experience in Go, Rust, or modern C++',
      'Passion for scalable distributed systems',
    ],
    skills: ['Go', 'Kubernetes', 'eBPF', 'Docker', 'Distributed Systems'],
    applyUrl: 'https://careers.example.com/cloudmatrix',
    status: 'active',
  },
  {
    title: 'Generative AI Research Fellow',
    company: 'Nexus Cognitive Research',
    logoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=128',
    location: 'New York, NY',
    workplaceType: 'On-site',
    type: 'Research Fellowship',
    stipend: '$6,000 / month + Grant Support',
    deadline: '2026-11-01',
    description: 'Conduct novel research into reasoning models, code generation evaluation benchmarks, and safe tool use for autonomous agentic workflows.',
    requirements: [
      'Track record in ML research, Kaggle GM, or open source contributions',
      'Deep fluency with PyTorch and HuggingFace Transformers',
      'Authored or co-authored research papers are a strong plus',
    ],
    skills: ['PyTorch', 'Transformers', 'Reinforcement Learning', 'Python'],
    applyUrl: 'https://careers.example.com/nexus-research',
    status: 'active',
  },
  {
    title: 'Cyber Threat Intelligence Associate',
    company: 'Aegis Cyber Defense',
    logoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=128',
    location: 'Austin, TX (Hybrid)',
    workplaceType: 'Hybrid',
    type: 'Part-time',
    stipend: '$38 / hour',
    deadline: '2026-10-20',
    description: 'Monitor advanced persistent threat (APT) groups, analyze malware samples in sandbox environments, and draft actionable mitigation guides.',
    requirements: [
      'Solid grasp of x86/x64 disassembly, IDA Pro / Ghidra',
      'Understanding of MITRE ATT&CK framework',
    ],
    skills: ['Reverse Engineering', 'Ghidra', 'Wireshark', 'Python'],
    applyUrl: 'https://careers.example.com/aegis',
    status: 'active',
  },
];

export const initialClubs = [
  {
    name: 'NeuroTech Society',
    category: 'Robotics & AI',
    tagline: 'Pioneering Brain-Computer Interfaces and Machine Consciousness',
    description: 'We design EEG-controlled drones, develop open-source neural decoding pipelines, and host weekly AI journal discussions.',
    lead: { name: 'Kaelen Voss', email: 'k.voss@campusos.edu', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=128' },
    membersCount: 88,
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=128',
    bannerUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800',
    recruitmentOpen: true,
    meetingsSchedule: 'Every Tuesday @ 6:00 PM in AI Lab 2',
    socialLinks: { discord: 'https://discord.gg/campus-neuro', github: 'https://github.com/neurotech-society' },
    tags: ['BCI', 'Neural Networks', 'Hardware', 'Research'],
  },
  {
    name: 'ZeroDay Cybersecurity Guild',
    category: 'Cybersecurity',
    tagline: 'Defenders of the Campus Mesh Network',
    description: 'Hands-on ethical hacking, collegiate CTF tournaments, bug bounty sprints, and reverse engineering research group.',
    lead: { name: 'Sora Tanaka', email: 's.tanaka@campusos.edu', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=128' },
    membersCount: 124,
    logoUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=128',
    bannerUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
    recruitmentOpen: true,
    meetingsSchedule: 'Thursdays @ 7:00 PM in SecOps Bunker',
    socialLinks: { discord: 'https://discord.gg/zeroday-guild', github: 'https://github.com/zeroday-guild' },
    tags: ['Security', 'CTF', 'Cryptography', 'Linux'],
  },
  {
    name: 'Spatial Computing & XR Foundry',
    category: 'Technical',
    tagline: 'Architecting 3D Worlds and Spatial Web Interfaces',
    description: 'We experiment with WebGPU, Three.js, VisionOS spatial UI, and generative procedural shaders for next-gen interactive web applications.',
    lead: { name: 'Zoe Martinez', email: 'z.martinez@campusos.edu', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=128' },
    membersCount: 95,
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=128',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=800',
    recruitmentOpen: true,
    meetingsSchedule: 'Wednesdays @ 5:30 PM in XR Studio 104',
    socialLinks: { discord: 'https://discord.gg/xr-foundry', github: 'https://github.com/xr-foundry' },
    tags: ['ThreeJS', 'WebGPU', 'XR', 'CreativeCoding'],
  },
  {
    name: 'Autonomous Flight & Drone Lab',
    category: 'Robotics & AI',
    tagline: 'Designing Swarm Intelligence for Unmanned Aerial Systems',
    description: 'Building custom carbon-fiber racing drones, autonomous waypoint navigation with onboard optical flow, and aerial search algorithms.',
    lead: { name: 'Marcus Bell', email: 'm.bell@campusos.edu', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=128' },
    membersCount: 67,
    logoUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=128',
    bannerUrl: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    recruitmentOpen: false,
    meetingsSchedule: 'Saturdays @ 10:00 AM at Campus Flight Field',
    socialLinks: { discord: 'https://discord.gg/drone-lab', instagram: 'https://instagram.com/drone_lab' },
    tags: ['Drones', 'Hardware', 'Autonomous', 'ROS'],
  },
];

export const initialAnnouncements = [
  {
    title: '🚨 Urgent: Mid-Semester Exam Portal Registration Deadline',
    content: 'All undergraduate and graduate students must confirm course verification slips by Friday 11:59 PM. Hall tickets will be issued through CampusOS QR pass.',
    priority: 'urgent',
    category: 'Examination',
    author: { name: 'Registrar Academic Office', role: 'Chief Controller of Exams' },
    pinned: true,
    actionUrl: '/academics',
    tags: ['Exam', 'Deadline', 'Mandatory'],
  },
  {
    title: '⚡ Campus Supercomputer GPU Cluster (Cluster-Delta) Online',
    content: 'Students enrolled in CS-401 and CS-415 can now request SLURM job allocations on our 32x H100 GPU cluster through the CampusOS Resources hub.',
    priority: 'high',
    category: 'Academic',
    author: { name: 'High-Performance Computing Center', role: 'SysAdmin Team' },
    pinned: true,
    actionUrl: '/resources',
    tags: ['HPC', 'H100', 'Compute', 'Research'],
  },
  {
    title: '💼 CampusOS Fall Career Fair: Top Tier Tech Companies Confirmed',
    content: 'Over 65 engineering and deep-tech firms will be recruiting on campus on October 22. Update your profile and bookmark internships in the Career Hub.',
    priority: 'normal',
    category: 'Placement',
    author: { name: 'University Career & Placement Cell', role: 'Placement Director' },
    pinned: false,
    actionUrl: '/internships',
    tags: ['Internships', 'Jobs', 'CareerFair'],
  },
  {
    title: '🚀 CampusOS v2.4 Live: New Spatial 3D Map & Realtime Notifications',
    content: 'Welcome to the upgraded CampusOS experience featuring reactive attendance tracking, hackathon team matching, and low-latency notifications.',
    priority: 'normal',
    category: 'Administrative',
    author: { name: 'CampusOS Core Engineering', role: 'System Architect' },
    pinned: false,
    actionUrl: '/dashboard',
    tags: ['Release', 'Update', 'Features'],
  },
];

export const initialResources = [
  {
    title: 'CS-401 Midterm Examination Paper 2025 (With Solution Keys)',
    subject: 'Distributed Systems & Cloud Architecture',
    courseCode: 'CS-401',
    department: 'Computer Science',
    semester: 5,
    type: 'past_paper',
    year: 2025,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '2.8 MB',
    format: 'PDF',
    uploadedBy: { name: 'Dr. Aris Thorne', role: 'Course Instructor' },
    downloads: 142,
    tags: ['Midterm', 'Solutions', 'Past Paper'],
  },
  {
    title: 'Deep Learning & Transformer Architectures: Comprehensive Lecture Notes',
    subject: 'Neural Networks & Deep Generative AI',
    courseCode: 'CS-415',
    department: 'Artificial Intelligence',
    semester: 5,
    type: 'lecture_notes',
    year: 2026,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '8.4 MB',
    format: 'PDF',
    uploadedBy: { name: 'Prof. Maya Lin', role: 'Professor' },
    downloads: 320,
    tags: ['Transformers', 'Attention', 'LLMs', 'Math'],
  },
  {
    title: 'Post-Quantum Cryptography & Zero-Knowledge Proofs Lab Manual',
    subject: 'Cyber Defense & Zero-Trust Cryptography',
    courseCode: 'CS-320',
    department: 'Cybersecurity',
    semester: 5,
    type: 'lab_manual',
    year: 2026,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '4.1 MB',
    format: 'PDF',
    uploadedBy: { name: 'Cmdr. Vance Sterling', role: 'Faculty' },
    downloads: 98,
    tags: ['Lab', 'ZK-SNARKs', 'Rust'],
  },
  {
    title: 'Three.js & WebGL Shaders Cheatsheet & Boilerplate',
    subject: 'Spatial Computing & 3D Web Graphics',
    courseCode: 'CS-388',
    department: 'Human-Computer Interaction',
    semester: 5,
    type: 'cheatsheet',
    year: 2026,
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    fileSize: '1.2 MB',
    format: 'PDF',
    uploadedBy: { name: 'Elena Rostova', role: 'XR Studio Lead' },
    downloads: 215,
    tags: ['GLSL', 'Shaders', 'Three.js', 'QuickRef'],
  },
];

export const initialNotifications = [
  {
    title: 'Class Reminder: CS-401 in 30 Minutes',
    message: 'Distributed Systems & Cloud Architecture lecture starts at 09:00 AM in Cyber Hall Alpha.',
    type: 'academic',
    actionLink: '/academics',
  },
  {
    title: 'Hackathon Registration Confirmed',
    message: 'Your pre-registration for CampusOS Global Hackathon 2026 is confirmed. Assemble your squad!',
    type: 'hackathon',
    actionLink: '/hackathons',
  },
  {
    title: 'New Internship Matching Your Profile',
    message: 'Voxel Dynamics Labs posted Autonomous Systems & Robotics Intern ($52/hr).',
    type: 'internship',
    actionLink: '/internships',
  },
  {
    title: 'URGENT: Exam Slip Confirmation',
    message: 'Mid-Semester verification deadline approaches this Friday.',
    type: 'alert',
    actionLink: '/academics',
  },
];

// CLI Seeder function
export const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment.');
      return;
    }

    await mongoose.connect(mongoUri);
    console.log('⚡ Connected to MongoDB for seeding...');

    // Clear old collections
    await User.deleteMany();
    await Course.deleteMany();
    await Event.deleteMany();
    await Hackathon.deleteMany();
    await Internship.deleteMany();
    await Club.deleteMany();
    await Announcement.deleteMany();
    await Resource.deleteMany();
    await Notification.deleteMany();

    console.log('🧹 Existing collections cleared.');

    // Seed Admin & Student Users (plain password will be hashed once by User pre('save') hook)
    const admin = await User.create({
      name: 'Dr. Sarah Connor',
      email: 'admin@campusos.edu',
      password: 'Admin@123',
      role: 'admin',
      studentId: 'ADMIN-001',
      department: 'CampusOS Systems Administration',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      bio: 'Head of CampusOS Operations & Dean of Digital Transformation',
    });

    const student = await User.create({
      name: 'Alex Chen',
      email: 'alex@campusos.edu',
      password: 'Student@123',
      role: 'student',
      studentId: 'CP-892144',
      department: 'Computer Science & Engineering',
      year: 3,
      semester: 5,
      cgpa: 3.89,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      bio: 'Distributed Systems & Cyber Defense Researcher | CampusOS Alpha Tester',
    });

    console.log('👤 Users seeded:');
    console.log('   - Admin: admin@campusos.edu / Admin@123');
    console.log('   - Student: alex@campusos.edu / Student@123');

    // Seed Courses
    const courses = await Course.insertMany(initialCourses);
    // Link courses to student
    student.enrolledCourses = courses.map((c) => c._id);
    await student.save();
    console.log(`📚 Seeded ${courses.length} Courses`);

    // Seed Events
    const events = await Event.insertMany(initialEvents);
    console.log(`🎉 Seeded ${events.length} Events`);

    // Seed Hackathons
    const hackathons = await Hackathon.insertMany(initialHackathons);
    console.log(`⚡ Seeded ${hackathons.length} Hackathons`);

    // Seed Internships
    const internships = await Internship.insertMany(initialInternships);
    console.log(`💼 Seeded ${internships.length} Internships`);

    // Seed Clubs
    const clubs = await Club.insertMany(initialClubs);
    console.log(`🛡️ Seeded ${clubs.length} Clubs`);

    // Seed Announcements
    const announcements = await Announcement.insertMany(initialAnnouncements);
    console.log(`📢 Seeded ${announcements.length} Announcements`);

    // Seed Resources
    const resources = await Resource.insertMany(initialResources);
    console.log(`📄 Seeded ${resources.length} Resources`);

    // Seed Notifications
    const notifications = await Notification.insertMany(
      initialNotifications.map((n) => ({ ...n, recipient: null }))
    );
    console.log(`🔔 Seeded ${notifications.length} Notifications`);

    console.log('\n✨ [CampusOS Database Seed Complete] ✨\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seedData.js')) {
  seedDB();
}
