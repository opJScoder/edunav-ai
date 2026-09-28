const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// ─── CONFIGURATION ───────────────────────────────────────
const DEMO_PASSWORD = 'password123';
const STUDENT_COUNT = 20;

// ─── SKILLS DATA (40 skills) ─────────────────────────────
const skillsData = [
  { name: 'Dart', category: 'Programming Languages', description: 'Client-optimized programming language for fast apps', difficulty: 'Beginner' },
  { name: 'Java', category: 'Programming Languages', description: 'Object-oriented programming language for enterprise applications', difficulty: 'Intermediate' },
  { name: 'Python', category: 'Programming Languages', description: 'Versatile language for web, data science, and automation', difficulty: 'Beginner' },
  { name: 'C', category: 'Programming Languages', description: 'Low-level procedural programming language', difficulty: 'Intermediate' },
  { name: 'C++', category: 'Programming Languages', description: 'High-performance language for system programming', difficulty: 'Advanced' },
  { name: 'JavaScript', category: 'Programming Languages', description: 'The language of the web for frontend and backend', difficulty: 'Beginner' },
  { name: 'TypeScript', category: 'Programming Languages', description: 'Typed superset of JavaScript for large applications', difficulty: 'Intermediate' },
  { name: 'React', category: 'Web Development', description: 'JavaScript library for building user interfaces', difficulty: 'Intermediate' },
  { name: 'Node.js', category: 'Web Development', description: 'JavaScript runtime for server-side development', difficulty: 'Intermediate' },
  { name: 'Express.js', category: 'Web Development', description: 'Fast, minimalist web framework for Node.js', difficulty: 'Beginner' },
  { name: 'HTML', category: 'Web Development', description: 'Standard markup language for creating web pages', difficulty: 'Beginner' },
  { name: 'CSS', category: 'Web Development', description: 'Styling language for describing presentation of web pages', difficulty: 'Beginner' },
  { name: 'Flutter', category: 'Mobile Development', description: 'Google UI toolkit for building natively compiled apps', difficulty: 'Intermediate' },
  { name: 'SQL', category: 'Database', description: 'Standard language for relational database management', difficulty: 'Beginner' },
  { name: 'PostgreSQL', category: 'Database', description: 'Advanced open-source relational database', difficulty: 'Intermediate' },
  { name: 'MongoDB', category: 'Database', description: 'NoSQL document-oriented database', difficulty: 'Beginner' },
  { name: 'Firebase', category: 'Database', description: 'Google backend-as-a-service with real-time database', difficulty: 'Beginner' },
  { name: 'REST API', category: 'Web Development', description: 'Architectural style for designing networked applications', difficulty: 'Intermediate' },
  { name: 'Git', category: 'Tools', description: 'Distributed version control system', difficulty: 'Beginner' },
  { name: 'GitHub', category: 'Tools', description: 'Platform for version control and collaboration', difficulty: 'Beginner' },
  { name: 'Docker', category: 'DevOps', description: 'Platform for developing, shipping, and running containers', difficulty: 'Intermediate' },
  { name: 'AWS', category: 'Cloud', description: 'Amazon Web Services cloud computing platform', difficulty: 'Advanced' },
  { name: 'Cloud Computing', category: 'Cloud', description: 'On-demand delivery of IT resources over the internet', difficulty: 'Intermediate' },
  { name: 'Linux', category: 'Systems', description: 'Open-source Unix-like operating system', difficulty: 'Intermediate' },
  { name: 'Machine Learning', category: 'AI & Data Science', description: 'Algorithms that improve through data experience', difficulty: 'Advanced' },
  { name: 'Deep Learning', category: 'AI & Data Science', description: 'Neural networks with many layers for complex patterns', difficulty: 'Advanced' },
  { name: 'Data Analysis', category: 'AI & Data Science', description: 'Process of inspecting, cleansing, and modeling data', difficulty: 'Intermediate' },
  { name: 'Statistics', category: 'AI & Data Science', description: 'Mathematical study of data collection and interpretation', difficulty: 'Intermediate' },
  { name: 'Data Visualization', category: 'AI & Data Science', description: 'Graphical representation of data and information', difficulty: 'Beginner' },
  { name: 'Cybersecurity', category: 'Security', description: 'Protection of computer systems from theft and damage', difficulty: 'Advanced' },
  { name: 'Computer Networks', category: 'Systems', description: 'Connecting computing devices to share resources', difficulty: 'Intermediate' },
  { name: 'Operating Systems', category: 'Systems', description: 'System software managing hardware and software resources', difficulty: 'Intermediate' },
  { name: 'System Design', category: 'Systems', description: 'Designing scalable and reliable system architectures', difficulty: 'Advanced' },
  { name: 'Data Structures', category: 'Computer Science', description: 'Way of organizing data for efficient use', difficulty: 'Intermediate' },
  { name: 'Algorithms', category: 'Computer Science', description: 'Step-by-step procedures for calculations', difficulty: 'Intermediate' },
  { name: 'UI/UX', category: 'Design', description: 'User interface and user experience design principles', difficulty: 'Beginner' },
  { name: 'Figma', category: 'Design', description: 'Collaborative web application for interface design', difficulty: 'Beginner' },
  { name: 'IoT', category: 'Engineering', description: 'Internet of Things - network of physical devices', difficulty: 'Intermediate' },
  { name: 'CAD', category: 'Engineering', description: 'Computer-Aided Design for engineering drawings', difficulty: 'Intermediate' },
  { name: 'Engineering Drawing', category: 'Engineering', description: 'Technical drawings for engineering designs', difficulty: 'Intermediate' },
  { name: '3D Modeling', category: 'Engineering', description: 'Creating 3D digital representations of objects', difficulty: 'Advanced' },
  { name: 'MATLAB', category: 'Engineering', description: 'Programming platform for engineering computation', difficulty: 'Intermediate' },
  { name: 'Communication', category: 'Soft Skills', description: 'Effective exchange of information and ideas', difficulty: 'Beginner' },
  { name: 'Problem Solving', category: 'Soft Skills', description: 'Ability to find solutions to complex challenges', difficulty: 'Intermediate' },
];

// ─── CAREERS DATA (20 careers) ───────────────────────────
const careersData = [
  { title: 'Flutter Developer', description: 'Build cross-platform mobile applications using Flutter framework', category: 'Mobile Development', difficulty: 'Intermediate', averageLearningHours: 500, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Full Stack Developer', description: 'Work on both frontend and backend of web applications', category: 'Web Development', difficulty: 'Intermediate', averageLearningHours: 600, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Frontend Developer', description: 'Build user interfaces and client-side logic for web apps', category: 'Web Development', difficulty: 'Beginner', averageLearningHours: 400, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Backend Developer', description: 'Design and implement server-side logic and APIs', category: 'Web Development', difficulty: 'Intermediate', averageLearningHours: 450, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Software Engineer', description: 'Design, develop, and maintain software systems', category: 'Software Development', difficulty: 'Intermediate', averageLearningHours: 700, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'AI/ML Engineer', description: 'Build and deploy machine learning models and AI systems', category: 'AI & Data Science', difficulty: 'Advanced', averageLearningHours: 800, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Data Analyst', description: 'Analyze data to help organizations make informed decisions', category: 'AI & Data Science', difficulty: 'Intermediate', averageLearningHours: 400, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Data Scientist', description: 'Extract insights from complex data using statistical methods', category: 'AI & Data Science', difficulty: 'Advanced', averageLearningHours: 700, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Cybersecurity Analyst', description: 'Protect organizations from cyber threats and attacks', category: 'Security', difficulty: 'Advanced', averageLearningHours: 600, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Cloud Engineer', description: 'Design and manage cloud infrastructure on AWS/Azure/GCP', category: 'Cloud', difficulty: 'Advanced', averageLearningHours: 550, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'DevOps Engineer', description: 'Bridge development and operations with automation', category: 'DevOps', difficulty: 'Advanced', averageLearningHours: 600, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Mobile App Developer', description: 'Build native or cross-platform mobile applications', category: 'Mobile Development', difficulty: 'Intermediate', averageLearningHours: 500, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'UI/UX Developer', description: 'Design and implement beautiful user interfaces', category: 'Design', difficulty: 'Beginner', averageLearningHours: 350, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Embedded Systems Engineer', description: 'Design hardware-software integrated systems', category: 'Electronics', difficulty: 'Advanced', averageLearningHours: 700, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'IoT Engineer', description: 'Build Internet of Things solutions and connected devices', category: 'Engineering', difficulty: 'Advanced', averageLearningHours: 650, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Network Engineer', description: 'Design and manage computer networks and infrastructure', category: 'Networking', difficulty: 'Intermediate', averageLearningHours: 500, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Electrical Design Engineer', description: 'Design electrical systems and components', category: 'Electrical', difficulty: 'Advanced', averageLearningHours: 650, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Mechanical Design Engineer', description: 'Design mechanical systems and components using CAD', category: 'Mechanical', difficulty: 'Advanced', averageLearningHours: 700, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'CAD Engineer', description: 'Create detailed technical drawings using CAD software', category: 'Design', difficulty: 'Intermediate', averageLearningHours: 400, requiredEducation: 'Bachelor in Engineering/Technology' },
  { title: 'Civil Design Engineer', description: 'Design civil infrastructure like buildings and roads', category: 'Civil', difficulty: 'Advanced', averageLearningHours: 700, requiredEducation: 'Bachelor in Engineering/Technology' },
];

// ─── CAREER-SKILL RELATIONSHIPS ──────────────────────────
const careerSkillsMap = {
  'Flutter Developer': [
    { skill: 'Dart', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Flutter', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Firebase', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'REST API', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Git', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'UI/UX', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Full Stack Developer': [
    { skill: 'JavaScript', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'React', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Node.js', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Express.js', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'PostgreSQL', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'HTML', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'CSS', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'Git', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'REST API', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
  ],
  'Frontend Developer': [
    { skill: 'HTML', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'CSS', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'JavaScript', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'React', requiredLevel: 3, weight: 0.9, importance: 'HIGH' },
    { skill: 'UI/UX', requiredLevel: 3, weight: 0.7, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'TypeScript', requiredLevel: 2, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Backend Developer': [
    { skill: 'Node.js', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Express.js', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'PostgreSQL', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'REST API', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'JavaScript', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Docker', requiredLevel: 2, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Linux', requiredLevel: 2, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Software Engineer': [
    { skill: 'Java', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Data Structures', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Algorithms', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'C++', requiredLevel: 3, weight: 0.7, importance: 'MEDIUM' },
    { skill: 'System Design', requiredLevel: 3, weight: 0.7, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'SQL', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
  ],
  'AI/ML Engineer': [
    { skill: 'Python', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'Machine Learning', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Deep Learning', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Data Structures', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Statistics', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'SQL', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'Problem Solving', requiredLevel: 4, weight: 0.7, importance: 'HIGH' },
  ],
  'Data Analyst': [
    { skill: 'Python', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'SQL', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Data Analysis', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Statistics', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Data Visualization', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Data Scientist': [
    { skill: 'Python', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'Machine Learning', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Statistics', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'Deep Learning', requiredLevel: 3, weight: 0.7, importance: 'MEDIUM' },
    { skill: 'SQL', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'Data Visualization', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Data Analysis', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Algorithms', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Cybersecurity Analyst': [
    { skill: 'Cybersecurity', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Computer Networks', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Linux', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Python', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Operating Systems', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Problem Solving', requiredLevel: 4, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.3, importance: 'LOW' },
  ],
  'Cloud Engineer': [
    { skill: 'AWS', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Cloud Computing', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Docker', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Linux', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Python', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Computer Networks', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'System Design', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
  ],
  'DevOps Engineer': [
    { skill: 'Docker', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Linux', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'AWS', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Git', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Python', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Cloud Computing', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Computer Networks', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Mobile App Developer': [
    { skill: 'Flutter', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Dart', requiredLevel: 3, weight: 0.8, importance: 'HIGH' },
    { skill: 'Firebase', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'REST API', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Java', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'UI/UX', requiredLevel: 2, weight: 0.4, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'UI/UX Developer': [
    { skill: 'UI/UX', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'Figma', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'HTML', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'CSS', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'JavaScript', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'React', requiredLevel: 2, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Communication', requiredLevel: 3, weight: 0.4, importance: 'LOW' },
  ],
  'Embedded Systems Engineer': [
    { skill: 'C', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'C++', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Operating Systems', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'IoT', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Problem Solving', requiredLevel: 4, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'MATLAB', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'IoT Engineer': [
    { skill: 'IoT', requiredLevel: 4, weight: 1.0, importance: 'HIGH' },
    { skill: 'C', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'Python', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Computer Networks', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Cloud Computing', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Firebase', requiredLevel: 2, weight: 0.4, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Git', requiredLevel: 2, weight: 0.3, importance: 'LOW' },
  ],
  'Network Engineer': [
    { skill: 'Computer Networks', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'Linux', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Cybersecurity', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'Python', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Operating Systems', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Cloud Computing', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
  ],
  'Electrical Design Engineer': [
    { skill: 'Engineering Drawing', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'CAD', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'MATLAB', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'C', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: '3D Modeling', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
  ],
  'Mechanical Design Engineer': [
    { skill: 'CAD', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: '3D Modeling', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Engineering Drawing', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'MATLAB', requiredLevel: 3, weight: 0.6, importance: 'MEDIUM' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'C++', requiredLevel: 2, weight: 0.3, importance: 'LOW' },
  ],
  'CAD Engineer': [
    { skill: 'CAD', requiredLevel: 5, weight: 1.0, importance: 'HIGH' },
    { skill: 'Engineering Drawing', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: '3D Modeling', requiredLevel: 4, weight: 0.8, importance: 'HIGH' },
    { skill: 'MATLAB', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
  ],
  'Civil Design Engineer': [
    { skill: 'CAD', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: 'Engineering Drawing', requiredLevel: 4, weight: 0.9, importance: 'HIGH' },
    { skill: '3D Modeling', requiredLevel: 3, weight: 0.7, importance: 'HIGH' },
    { skill: 'MATLAB', requiredLevel: 2, weight: 0.4, importance: 'LOW' },
    { skill: 'Problem Solving', requiredLevel: 3, weight: 0.5, importance: 'MEDIUM' },
    { skill: 'Communication', requiredLevel: 3, weight: 0.4, importance: 'LOW' },
  ],
};

// ─── STUDENT DATA ────────────────────────────────────────
const branches = [
  'Computer Engineering', 'Information Technology', 'Electronics Engineering',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
];

const colleges = [
  'National Institute of Technology', 'Indian Institute of Technology',
  'Delhi Technological University', 'Birla Institute of Technology',
  'Anna University', 'Jadavpur University', 'College of Engineering Pune',
];

const studentNames = [
  'Aarav Sharma', 'Diya Patel', 'Arjun Singh', 'Ananya Gupta',
  'Vikram Reddy', 'Priya Nair', 'Rohan Mehta', 'Sneha Iyer',
  'Aditya Kumar', 'Kavya Menon', 'Rahul Verma', 'Pooja Joshi',
  'Karan Malhotra', 'Divya Pillai', 'Siddharth Rao', 'Meera Krishnan',
  'Nikhil Agarwal', 'Ritu Chauhan', 'Manish Tiwari', 'Shreya Das',
];

const bios = [
  'Passionate about building scalable web applications and exploring new technologies.',
  'Interested in machine learning and data science. Currently working on Python projects.',
  'Mobile app developer with a love for clean UI and smooth user experiences.',
  'Aspiring full-stack developer with experience in React and Node.js.',
  'Cybersecurity enthusiast who loves solving CTF challenges.',
  'Cloud computing enthusiast exploring AWS and DevOps practices.',
  'IoT hobbyist building smart home solutions with Raspberry Pi.',
  'Data analyst with strong skills in SQL and Python.',
  'Frontend developer with an eye for design and accessibility.',
  'Backend developer focused on building robust APIs and microservices.',
];

// ─── PROJECTS DATA (25 projects) ─────────────────────────
const projectsData = [
  { title: 'Student Attendance App', description: 'A mobile app to track student attendance with QR code scanning', difficulty: 'Intermediate', estimatedHours: 80, technologies: ['Flutter', 'Firebase', 'REST API'], features: ['QR scanning', 'Real-time sync', 'Reports'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Expense Tracker', description: 'Track daily expenses with charts and budget management', difficulty: 'Beginner', estimatedHours: 40, technologies: ['React', 'Node.js', 'PostgreSQL'], features: ['Charts', 'Budget alerts', 'Export CSV'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'College Event App', description: 'Discover and register for college events and workshops', difficulty: 'Intermediate', estimatedHours: 60, technologies: ['Flutter', 'Firebase', 'Git'], features: ['Event listing', 'RSVP', 'Notifications'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Medicine Reminder', description: 'Never miss a dose with smart medicine reminders', difficulty: 'Beginner', estimatedHours: 30, technologies: ['Flutter', 'Firebase'], features: ['Schedules', 'Notifications', 'History'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'AI Study Assistant', description: 'Chatbot that helps students with study questions using AI', difficulty: 'Advanced', estimatedHours: 120, technologies: ['Python', 'Machine Learning', 'REST API'], features: ['Q&A', 'Summarization', 'Quiz generation'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'E-Commerce App', description: 'Full-featured online shopping app with cart and payments', difficulty: 'Advanced', estimatedHours: 150, technologies: ['React', 'Node.js', 'PostgreSQL', 'Firebase'], features: ['Cart', 'Payments', 'Orders'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Job Portal', description: 'Platform connecting students with job opportunities', difficulty: 'Advanced', estimatedHours: 130, technologies: ['React', 'Node.js', 'PostgreSQL'], features: ['Job listings', 'Applications', 'Profile'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Weather App', description: 'Beautiful weather app with forecasts and animations', difficulty: 'Beginner', estimatedHours: 25, technologies: ['Flutter', 'REST API'], features: ['Current weather', '7-day forecast', 'Animations'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Chat Application', description: 'Real-time messaging app with group chat support', difficulty: 'Intermediate', estimatedHours: 70, technologies: ['React', 'Node.js', 'Firebase'], features: ['Real-time', 'Groups', 'Media sharing'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Portfolio Website', description: 'Personal portfolio website to showcase your projects', difficulty: 'Beginner', estimatedHours: 20, technologies: ['React', 'HTML', 'CSS'], features: ['Responsive', 'Projects', 'Contact form'], branchCompatibility: ['Computer Engineering', 'Information Technology', 'Electronics Engineering'] },
  { title: 'Learning Management System', description: 'Platform for online courses and assignments', difficulty: 'Advanced', estimatedHours: 160, technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'], features: ['Courses', 'Assignments', 'Grades'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Campus Navigation App', description: 'Navigate your campus with indoor maps and directions', difficulty: 'Intermediate', estimatedHours: 90, technologies: ['Flutter', 'Firebase', 'REST API'], features: ['Indoor maps', 'Directions', 'POI search'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'IoT Monitoring Dashboard', description: 'Monitor IoT sensors data in real-time dashboard', difficulty: 'Advanced', estimatedHours: 110, technologies: ['Python', 'IoT', 'Cloud Computing', 'React'], features: ['Real-time data', 'Alerts', 'Analytics'], branchCompatibility: ['Electronics Engineering', 'Electrical Engineering', 'Computer Engineering'] },
  { title: 'Network Monitoring Tool', description: 'Monitor network devices and detect anomalies', difficulty: 'Advanced', estimatedHours: 100, technologies: ['Python', 'Computer Networks', 'Linux'], features: ['Device monitoring', 'Alerts', 'Reports'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Cybersecurity Learning Dashboard', description: 'Interactive platform to learn cybersecurity concepts', difficulty: 'Intermediate', estimatedHours: 85, technologies: ['React', 'Node.js', 'Cybersecurity'], features: ['Lessons', 'Challenges', 'Progress tracking'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Inventory Management System', description: 'Manage inventory with barcode scanning and reports', difficulty: 'Intermediate', estimatedHours: 75, technologies: ['Java', 'PostgreSQL', 'React'], features: ['Barcode', 'Reports', 'Low stock alerts'], branchCompatibility: ['Computer Engineering', 'Information Technology', 'Mechanical Engineering'] },
  { title: 'College Complaint Portal', description: 'Submit and track complaints about college facilities', difficulty: 'Beginner', estimatedHours: 35, technologies: ['Flutter', 'Firebase'], features: ['Submit complaints', 'Track status', 'Notifications'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Smart Timetable Generator', description: 'Automatically generate conflict-free timetables', difficulty: 'Intermediate', estimatedHours: 55, technologies: ['Python', 'Algorithms', 'React'], features: ['Auto-generation', 'Conflict detection', 'Export'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'Resume Builder', description: 'Create professional resumes with customizable templates', difficulty: 'Beginner', estimatedHours: 30, technologies: ['React', 'Node.js'], features: ['Templates', 'PDF export', 'Preview'], branchCompatibility: ['Computer Engineering', 'Information Technology', 'Electronics Engineering'] },
  { title: 'Placement Preparation App', description: 'Practice aptitude, coding, and interview questions', difficulty: 'Advanced', estimatedHours: 140, technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'], features: ['Practice tests', 'Interview prep', 'Progress tracking'], branchCompatibility: ['Computer Engineering', 'Information Technology'] },
  { title: 'CAD Model Viewer', description: 'Web-based 3D CAD model viewer and annotator', difficulty: 'Advanced', estimatedHours: 120, technologies: ['React', 'Three.js', 'CAD'], features: ['3D viewer', 'Annotations', 'Measurements'], branchCompatibility: ['Mechanical Engineering', 'Civil Engineering', 'Electrical Engineering'] },
  { title: 'Embedded Systems Simulator', description: 'Simulate embedded systems and microcontroller code', difficulty: 'Advanced', estimatedHours: 130, technologies: ['C', 'C++', 'IoT'], features: ['Simulation', 'Debugging', 'Peripheral config'], branchCompatibility: ['Electronics Engineering', 'Electrical Engineering', 'Computer Engineering'] },
  { title: 'Electrical Circuit Designer', description: 'Design and simulate electrical circuits online', difficulty: 'Intermediate', estimatedHours: 95, technologies: ['CAD', 'Engineering Drawing', 'MATLAB'], features: ['Circuit design', 'Simulation', 'Export'], branchCompatibility: ['Electrical Engineering', 'Electronics Engineering'] },
  { title: 'Civil Structural Analyzer', description: 'Analyze structural loads and stresses in buildings', difficulty: 'Advanced', estimatedHours: 125, technologies: ['CAD', 'MATLAB', '3D Modeling'], features: ['Load analysis', 'Stress visualization', 'Reports'], branchCompatibility: ['Civil Engineering'] },
  { title: 'Mechanical Part Designer', description: 'Design mechanical parts with parametric modeling', difficulty: 'Advanced', estimatedHours: 115, technologies: ['CAD', '3D Modeling', 'C++'], features: ['Parametric design', 'Assembly', 'Export'], branchCompatibility: ['Mechanical Engineering'] },
];

// ─── MAIN SEED FUNCTION ─────────────────────────────────
async function main() {
  console.log('Starting PATHFORGE AI database seed...\n');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, salt);

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.progressSnapshot.deleteMany();
  await prisma.semesterGoal.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.projectSkill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.roadmapItem.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.careerSkill.deleteMany();
  await prisma.career.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();

  // 1. CREATE SKILLS
  console.log('Creating skills...');
  const skillRecords = {};
  for (const skillData of skillsData) {
    const skill = await prisma.skill.create({ data: skillData });
    skillRecords[skill.name] = skill.id;
  }
  console.log(`   Created ${Object.keys(skillRecords).length} skills`);

  // 2. CREATE CAREERS
  console.log('Creating careers...');
  const careerRecords = {};
  for (const careerData of careersData) {
    const career = await prisma.career.create({ data: careerData });
    careerRecords[career.title] = career.id;
  }
  console.log(`   Created ${Object.keys(careerRecords).length} careers`);

  // 3. CREATE CAREER SKILLS
  console.log('Creating career-skill relationships...');
  let careerSkillCount = 0;
  for (const [careerTitle, skills] of Object.entries(careerSkillsMap)) {
    const careerId = careerRecords[careerTitle];
    for (const cs of skills) {
      const skillId = skillRecords[cs.skill];
      if (skillId) {
        await prisma.careerSkill.create({
          data: { careerId, skillId, weight: cs.weight, requiredLevel: cs.requiredLevel, importance: cs.importance },
        });
        careerSkillCount++;
      }
    }
  }
  console.log(`   Created ${careerSkillCount} career-skill relationships`);

  // 4. CREATE USERS
  console.log('Creating users...');
  const userRecords = [];
  for (let i = 0; i < STUDENT_COUNT; i++) {
    const user = await prisma.user.create({
      data: { name: studentNames[i], email: `student${String(i + 1).padStart(2, '0')}@pathforge.demo`, passwordHash, role: 'student' },
    });
    userRecords.push(user);
  }
  console.log(`   Created ${userRecords.length} users`);

  // 5. CREATE STUDENT PROFILES
  console.log('Creating student profiles...');
  const profileRecords = [];
  for (let i = 0; i < STUDENT_COUNT; i++) {
    const careerGoal = careersData[i % careersData.length];
    const profile = await prisma.studentProfile.create({
      data: {
        userId: userRecords[i].id,
        branch: branches[i % branches.length],
        semester: (i % 8) + 1,
        college: colleges[i % colleges.length],
        careerGoalId: careerRecords[careerGoal.title],
        studyHoursPerWeek: 5 + (i % 15),
        bio: bios[i % bios.length],
      },
    });
    profileRecords.push(profile);
  }
  console.log(`   Created ${profileRecords.length} profiles`);

  // 6. CREATE STUDENT SKILLS
  console.log('Creating student skills...');
  const studentSkillSets = [
    [{ skill: 'Dart', level: 3 }, { skill: 'Flutter', level: 2 }, { skill: 'Firebase', level: 2 }, { skill: 'Git', level: 3 }, { skill: 'UI/UX', level: 2 }, { skill: 'Problem Solving', level: 3 }, { skill: 'REST API', level: 1 }],
    [{ skill: 'JavaScript', level: 4 }, { skill: 'React', level: 3 }, { skill: 'Node.js', level: 3 }, { skill: 'Express.js', level: 3 }, { skill: 'PostgreSQL', level: 2 }, { skill: 'HTML', level: 4 }, { skill: 'CSS', level: 3 }, { skill: 'Git', level: 3 }],
    [{ skill: 'HTML', level: 4 }, { skill: 'CSS', level: 4 }, { skill: 'JavaScript', level: 4 }, { skill: 'React', level: 3 }, { skill: 'UI/UX', level: 3 }, { skill: 'Git', level: 2 }, { skill: 'TypeScript', level: 2 }],
    [{ skill: 'Node.js', level: 4 }, { skill: 'Express.js', level: 4 }, { skill: 'PostgreSQL', level: 4 }, { skill: 'REST API', level: 4 }, { skill: 'JavaScript', level: 3 }, { skill: 'Docker', level: 2 }, { skill: 'Git', level: 3 }, { skill: 'Linux', level: 2 }],
    [{ skill: 'Java', level: 4 }, { skill: 'Data Structures', level: 4 }, { skill: 'Algorithms', level: 4 }, { skill: 'C++', level: 3 }, { skill: 'System Design', level: 2 }, { skill: 'Git', level: 3 }, { skill: 'Problem Solving', level: 4 }, { skill: 'SQL', level: 3 }],
    [{ skill: 'Python', level: 4 }, { skill: 'Machine Learning', level: 3 }, { skill: 'Deep Learning', level: 2 }, { skill: 'Statistics', level: 3 }, { skill: 'Data Structures', level: 3 }, { skill: 'SQL', level: 3 }, { skill: 'Git', level: 2 }, { skill: 'Problem Solving', level: 4 }],
    [{ skill: 'Python', level: 4 }, { skill: 'SQL', level: 4 }, { skill: 'Data Analysis', level: 3 }, { skill: 'Statistics', level: 3 }, { skill: 'Data Visualization', level: 3 }, { skill: 'Problem Solving', level: 3 }],
    [{ skill: 'Python', level: 5 }, { skill: 'Machine Learning', level: 4 }, { skill: 'Statistics', level: 4 }, { skill: 'Deep Learning', level: 3 }, { skill: 'SQL', level: 4 }, { skill: 'Data Visualization', level: 3 }, { skill: 'Data Analysis', level: 4 }, { skill: 'Algorithms', level: 3 }],
    [{ skill: 'Cybersecurity', level: 3 }, { skill: 'Computer Networks', level: 4 }, { skill: 'Linux', level: 3 }, { skill: 'Python', level: 3 }, { skill: 'Operating Systems', level: 3 }, { skill: 'Problem Solving', level: 4 }],
    [{ skill: 'AWS', level: 3 }, { skill: 'Cloud Computing', level: 4 }, { skill: 'Docker', level: 3 }, { skill: 'Linux', level: 4 }, { skill: 'Python', level: 3 }, { skill: 'Computer Networks', level: 2 }, { skill: 'Git', level: 2 }, { skill: 'System Design', level: 2 }],
    [{ skill: 'Docker', level: 4 }, { skill: 'Linux', level: 4 }, { skill: 'AWS', level: 3 }, { skill: 'Git', level: 3 }, { skill: 'Python', level: 3 }, { skill: 'Cloud Computing', level: 3 }, { skill: 'Problem Solving', level: 3 }],
    [{ skill: 'Flutter', level: 3 }, { skill: 'Dart', level: 3 }, { skill: 'Firebase', level: 3 }, { skill: 'REST API', level: 3 }, { skill: 'Java', level: 2 }, { skill: 'Git', level: 3 }, { skill: 'UI/UX', level: 2 }, { skill: 'Problem Solving', level: 3 }],
    [{ skill: 'UI/UX', level: 4 }, { skill: 'Figma', level: 4 }, { skill: 'HTML', level: 3 }, { skill: 'CSS', level: 3 }, { skill: 'JavaScript', level: 3 }, { skill: 'React', level: 2 }, { skill: 'Communication', level: 3 }],
    [{ skill: 'C', level: 4 }, { skill: 'C++', level: 4 }, { skill: 'Operating Systems', level: 3 }, { skill: 'IoT', level: 2 }, { skill: 'Problem Solving', level: 4 }, { skill: 'Git', level: 2 }, { skill: 'MATLAB', level: 3 }],
    [{ skill: 'IoT', level: 3 }, { skill: 'C', level: 4 }, { skill: 'Python', level: 3 }, { skill: 'Computer Networks', level: 3 }, { skill: 'Cloud Computing', level: 3 }, { skill: 'Firebase', level: 2 }, { skill: 'Problem Solving', level: 3 }, { skill: 'Git', level: 2 }],
    [{ skill: 'Computer Networks', level: 4 }, { skill: 'Linux', level: 3 }, { skill: 'Cybersecurity', level: 3 }, { skill: 'Python', level: 3 }, { skill: 'Operating Systems', level: 3 }, { skill: 'Problem Solving', level: 3 }, { skill: 'Cloud Computing', level: 2 }],
    [{ skill: 'Engineering Drawing', level: 4 }, { skill: 'CAD', level: 3 }, { skill: 'MATLAB', level: 3 }, { skill: 'C', level: 3 }, { skill: 'Problem Solving', level: 3 }, { skill: '3D Modeling', level: 2 }],
    [{ skill: 'CAD', level: 4 }, { skill: '3D Modeling', level: 4 }, { skill: 'Engineering Drawing', level: 4 }, { skill: 'MATLAB', level: 3 }, { skill: 'Problem Solving', level: 3 }, { skill: 'C++', level: 2 }],
    [{ skill: 'CAD', level: 5 }, { skill: 'Engineering Drawing', level: 4 }, { skill: '3D Modeling', level: 4 }, { skill: 'MATLAB', level: 2 }, { skill: 'Problem Solving', level: 3 }],
    [{ skill: 'CAD', level: 4 }, { skill: 'Engineering Drawing', level: 4 }, { skill: '3D Modeling', level: 3 }, { skill: 'MATLAB', level: 2 }, { skill: 'Problem Solving', level: 3 }, { skill: 'Communication', level: 3 }],
  ];

  let studentSkillCount = 0;
  for (let i = 0; i < STUDENT_COUNT; i++) {
    const skillSet = studentSkillSets[i];
    for (const ss of skillSet) {
      const skillId = skillRecords[ss.skill];
      if (skillId) {
        await prisma.studentSkill.create({ data: { studentId: userRecords[i].id, skillId, level: ss.level } });
        studentSkillCount++;
      }
    }
  }
  console.log(`   Created ${studentSkillCount} student skills`);

  // 7. CREATE PROJECTS
  console.log('Creating projects...');
  const projectRecords = [];
  for (const projData of projectsData) {
    const project = await prisma.project.create({
      data: {
        title: projData.title,
        description: projData.description,
        difficulty: projData.difficulty,
        estimatedHours: projData.estimatedHours,
        technologies: JSON.stringify(projData.technologies),
        features: JSON.stringify(projData.features),
        branchCompatibility: JSON.stringify(projData.branchCompatibility),
        githubTemplateUrl: `https://github.com/pathforge/${projData.title.toLowerCase().replace(/\s+/g, '-')}-template`,
      },
    });
    projectRecords.push(project);
  }
  console.log(`   Created ${projectRecords.length} projects`);

  // 8. CREATE PROJECT SKILLS
  console.log('Creating project-skill relationships...');
  const projectSkillMap = [
    ['Flutter', 'Firebase', 'REST API', 'Git', 'UI/UX'],
    ['React', 'Node.js', 'PostgreSQL', 'HTML', 'CSS'],
    ['Flutter', 'Firebase', 'Git', 'UI/UX'],
    ['Flutter', 'Firebase', 'UI/UX'],
    ['Python', 'Machine Learning', 'REST API', 'Git', 'Docker'],
    ['React', 'Node.js', 'PostgreSQL', 'Firebase', 'AWS', 'Git', 'Docker'],
    ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Git', 'Docker'],
    ['Flutter', 'REST API', 'Git'],
    ['React', 'Node.js', 'Firebase', 'Git', 'Docker'],
    ['React', 'HTML', 'CSS', 'JavaScript', 'Git'],
    ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git', 'Machine Learning'],
    ['Flutter', 'Firebase', 'REST API', 'Git', 'UI/UX'],
    ['Python', 'IoT', 'Cloud Computing', 'React', 'Firebase', 'Docker'],
    ['Python', 'Computer Networks', 'Linux', 'React', 'Git'],
    ['React', 'Node.js', 'Cybersecurity', 'PostgreSQL', 'Git'],
    ['Java', 'PostgreSQL', 'React', 'Git', 'Docker'],
    ['Flutter', 'Firebase', 'Git', 'UI/UX'],
    ['Python', 'Algorithms', 'React', 'PostgreSQL', 'Git'],
    ['React', 'Node.js', 'HTML', 'CSS', 'Git'],
    ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'Machine Learning'],
    ['React', 'Three.js', 'CAD', '3D Modeling', 'Git'],
    ['C', 'C++', 'IoT', 'Git', 'Docker'],
    ['CAD', 'Engineering Drawing', 'MATLAB', 'React'],
    ['CAD', 'MATLAB', '3D Modeling', 'Python', 'Git'],
    ['CAD', '3D Modeling', 'C++', 'Git'],
  ];

  let projectSkillCount = 0;
  for (let i = 0; i < projectRecords.length; i++) {
    const project = projectRecords[i];
    const skillNames = projectSkillMap[i] || [];
    for (const skillName of skillNames) {
      const skillId = skillRecords[skillName];
      if (skillId) {
        await prisma.projectSkill.create({ data: { projectId: project.id, skillId } });
        projectSkillCount++;
      }
    }
  }
  console.log(`   Created ${projectSkillCount} project-skill relationships`);

  // 9. CREATE ROADMAPS
  console.log('Creating roadmaps...');
  const roadmapRecords = [];
  const roadmapCareerIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const roadmapStatuses = ['in_progress', 'in_progress', 'completed', 'not_started', 'in_progress', 'completed', 'not_started', 'in_progress', 'in_progress', 'not_started'];

  for (let i = 0; i < 10; i++) {
    const careerIndex = roadmapCareerIndices[i];
    const careerTitle = careersData[careerIndex].title;
    const careerId = careerRecords[careerTitle];
    const roadmap = await prisma.roadmap.create({
      data: {
        studentId: userRecords[i].id,
        careerId,
        title: `${careerTitle} Learning Path`,
        description: `A structured roadmap to become a ${careerTitle}`,
        readinessAtCreation: 30 + Math.floor(Math.random() * 40),
        estimatedTotalHours: careersData[careerIndex].averageLearningHours,
        status: roadmapStatuses[i],
      },
    });
    roadmapRecords.push(roadmap);
  }
  console.log(`   Created ${roadmapRecords.length} roadmaps`);

  // 10. CREATE ROADMAP ITEMS
  console.log('Creating roadmap items...');
  const roadmapItemsData = [
    { title: 'Learn Fundamentals', description: 'Master the core concepts and basics', estimatedHours: 30, difficulty: 'Beginner' },
    { title: 'Practice with Projects', description: 'Build small projects to apply your knowledge', estimatedHours: 40, difficulty: 'Beginner' },
    { title: 'Intermediate Concepts', description: 'Dive deeper into advanced topics', estimatedHours: 50, difficulty: 'Intermediate' },
    { title: 'Build Real-world Projects', description: 'Create portfolio-worthy projects', estimatedHours: 60, difficulty: 'Intermediate' },
    { title: 'Advanced Topics', description: 'Master complex and specialized areas', estimatedHours: 70, difficulty: 'Advanced' },
    { title: 'Contribute to Open Source', description: 'Gain real-world experience by contributing', estimatedHours: 40, difficulty: 'Intermediate' },
    { title: 'Portfolio Development', description: 'Showcase your skills with a strong portfolio', estimatedHours: 30, difficulty: 'Beginner' },
    { title: 'Interview Preparation', description: 'Practice coding interviews and system design', estimatedHours: 50, difficulty: 'Advanced' },
  ];

  let roadmapItemCount = 0;
  const roadmapItemStatuses = ['completed', 'completed', 'in_progress', 'not_started', 'not_started', 'not_started', 'not_started', 'not_started'];

  for (const roadmap of roadmapRecords) {
    const itemCount = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < itemCount && i < roadmapItemsData.length; i++) {
      const itemData = roadmapItemsData[i];
      const status = roadmapItemStatuses[i];
      const progressPercentage = status === 'completed' ? 100 : status === 'in_progress' ? 50 : 0;
      const resources = JSON.stringify([
        { title: 'Official Documentation', url: 'https://docs.example.com', type: 'documentation' },
        { title: 'Video Tutorial', url: 'https://youtube.com/example', type: 'video' },
      ]);

      await prisma.roadmapItem.create({
        data: {
          roadmapId: roadmap.id,
          skillId: skillRecords[Object.keys(skillRecords)[i % Object.keys(skillRecords).length]],
          title: `${itemData.title} for ${roadmap.title}`,
          description: itemData.description,
          stepOrder: i + 1,
          estimatedHours: itemData.estimatedHours,
          difficulty: itemData.difficulty,
          resources,
          status,
          progressPercentage,
          completedAt: status === 'completed' ? new Date() : null,
        },
      });
      roadmapItemCount++;
    }
  }
  console.log(`   Created ${roadmapItemCount} roadmap items`);

  // 11. CREATE RECOMMENDATIONS
  console.log('Creating recommendations...');
  let recommendationCount = 0;
  for (let i = 0; i < 15; i++) {
    const student = userRecords[i];
    const project = projectRecords[i % projectRecords.length];
    const projectSkillNames = projectSkillMap[i % projectSkillMap.length] || [];
    const studentSkillSet = studentSkillSets[i];
    const studentSkillNames = studentSkillSet.map((s) => s.skill);
    const matchedSkills = projectSkillNames.filter((ps) => studentSkillNames.includes(ps));
    const matchPercentage = projectSkillNames.length > 0
      ? Math.round((matchedSkills.length / projectSkillNames.length) * 100)
      : 0;
    let priority = 'low';
    if (matchPercentage >= 70) priority = 'high';
    else if (matchPercentage >= 50) priority = 'medium';
    const reason = matchedSkills.length > 0
      ? `This project allows the student to practice ${matchedSkills.join(', ')} skills.`
      : `This project helps build ${projectSkillNames.slice(0, 3).join(', ')} skills.`;

    await prisma.recommendation.create({
      data: {
        studentId: student.id,
        projectId: project.id,
        reason,
        matchedSkills: JSON.stringify(matchedSkills),
        matchPercentage,
        priority,
      },
    });
    recommendationCount++;
  }
  console.log(`   Created ${recommendationCount} recommendations`);

  // 12. CREATE SEMESTER GOALS
  console.log('Creating semester goals...');
  const goalsData = [
    { title: 'Complete Dart Fundamentals', description: 'Finish Dart language basics and OOP concepts', semester: 1, targetDate: '2026-12-15', status: 'completed' },
    { title: 'Build First Flutter App', description: 'Create a simple counter app in Flutter', semester: 2, targetDate: '2027-01-20', status: 'completed' },
    { title: 'Learn PostgreSQL', description: 'Master SQL queries and database design', semester: 3, targetDate: '2027-03-10', status: 'in_progress' },
    { title: 'Complete 2 DSA Topics', description: 'Finish Arrays and Linked Lists', semester: 3, targetDate: '2027-02-28', status: 'in_progress' },
    { title: 'Build Portfolio', description: 'Create a personal portfolio website', semester: 4, targetDate: '2027-04-15', status: 'not_started' },
    { title: 'Learn Git Branching', description: 'Master Git workflow and branching strategies', semester: 2, targetDate: '2027-01-30', status: 'completed' },
    { title: 'Complete REST API Project', description: 'Build a full REST API with Node.js', semester: 4, targetDate: '2027-05-01', status: 'not_started' },
    { title: 'Practice SQL', description: 'Solve 50 SQL problems on HackerRank', semester: 3, targetDate: '2027-03-20', status: 'in_progress' },
    { title: 'Build Final Year Project Prototype', description: 'Create initial prototype for FYP', semester: 6, targetDate: '2027-08-15', status: 'not_started' },
    { title: 'Learn Docker', description: 'Understand containers and Docker Compose', semester: 4, targetDate: '2027-04-30', status: 'not_started' },
    { title: 'Complete Python Course', description: 'Finish Python for Data Science on Coursera', semester: 2, targetDate: '2027-02-15', status: 'completed' },
    { title: 'Build Machine Learning Model', description: 'Train first ML model with scikit-learn', semester: 5, targetDate: '2027-06-01', status: 'not_started' },
    { title: 'Learn React', description: 'Complete React tutorial and build 3 apps', semester: 3, targetDate: '2027-03-30', status: 'in_progress' },
    { title: 'Complete 10 LeetCode Problems', description: 'Solve 10 medium LeetCode problems', semester: 4, targetDate: '2027-05-15', status: 'not_started' },
    { title: 'Learn AWS Basics', description: 'Complete AWS Cloud Practitioner course', semester: 5, targetDate: '2027-07-01', status: 'not_started' },
    { title: 'Build IoT Project', description: 'Create a smart home sensor with Raspberry Pi', semester: 5, targetDate: '2027-06-15', status: 'not_started' },
    { title: 'Complete Statistics Course', description: 'Finish Statistics for Data Science', semester: 3, targetDate: '2027-04-01', status: 'not_started' },
    { title: 'Learn TypeScript', description: 'Migrate a JavaScript project to TypeScript', semester: 4, targetDate: '2027-05-30', status: 'not_started' },
    { title: 'Contribute to Open Source', description: 'Make first open source contribution', semester: 5, targetDate: '2027-07-15', status: 'not_started' },
    { title: 'Build Chat Application', description: 'Create real-time chat with Socket.io', semester: 4, targetDate: '2027-06-30', status: 'not_started' },
    { title: 'Complete CAD Certification', description: 'Finish AutoCAD certification course', semester: 3, targetDate: '2027-04-20', status: 'in_progress' },
    { title: 'Learn System Design', description: 'Complete System Design Primer on GitHub', semester: 6, targetDate: '2027-09-01', status: 'not_started' },
    { title: 'Build Mobile Game', description: 'Create a simple 2D game with Flutter', semester: 5, targetDate: '2027-08-01', status: 'not_started' },
    { title: 'Complete Cybersecurity Course', description: 'Finish Introduction to Cybersecurity', semester: 4, targetDate: '2027-07-15', status: 'not_started' },
    { title: 'Learn Kubernetes', description: 'Deploy first app on Kubernetes cluster', semester: 6, targetDate: '2027-10-01', status: 'not_started' },
  ];

  let goalCount = 0;
  for (let i = 0; i < 25; i++) {
    const student = userRecords[i % STUDENT_COUNT];
    const goalData = goalsData[i];
    const progressPercentage = goalData.status === 'completed' ? 100 : goalData.status === 'in_progress' ? 45 : 0;
    await prisma.semesterGoal.create({
      data: {
        studentId: student.id,
        title: goalData.title,
        description: goalData.description,
        semester: goalData.semester,
        targetDate: new Date(goalData.targetDate),
        progressPercentage,
        status: goalData.status,
      },
    });
    goalCount++;
  }
  console.log(`   Created ${goalCount} semester goals`);

  // 13. CREATE PROGRESS SNAPSHOTS
  console.log('Creating progress snapshots...');
  const skillsImprovedOptions = [
    ['JavaScript', 'React'],
    ['Python', 'Data Analysis'],
    ['Java', 'Data Structures'],
    ['C', 'C++'],
    ['SQL', 'PostgreSQL'],
    ['Flutter', 'Dart'],
    ['Node.js', 'Express.js'],
    ['Git', 'GitHub'],
    ['Docker', 'Linux'],
    ['Machine Learning', 'Python'],
  ];

  let snapshotCount = 0;
  for (let i = 0; i < 20; i++) {
    const student = userRecords[i];
    for (let j = 0; j < 15; j++) {
      const date = new Date();
      date.setDate(date.getDate() - (15 - j) * 2);
      const studyHours = parseFloat((2 + Math.random() * 4).toFixed(1));
      const completedRoadmapItems = Math.floor(j / 3);
      const completedProjects = Math.floor(j / 7);
      const readinessPercentage = parseFloat((20 + j * 3 + Math.random() * 5).toFixed(1));
      const skillsImproved = skillsImprovedOptions[(i + j) % skillsImprovedOptions.length];

      await prisma.progressSnapshot.create({
        data: {
          studentId: student.id,
          date,
          studyHours,
          completedRoadmapItems,
          completedProjects,
          readinessPercentage: Math.min(readinessPercentage, 95),
          skillsImproved: JSON.stringify(skillsImproved),
        },
      });
      snapshotCount++;
    }
  }
  console.log(`   Created ${snapshotCount} progress snapshots`);

  // SUMMARY
  console.log('\nSeed completed successfully!\n');
  console.log('==================================================');
  console.log('  DATABASE SEED SUMMARY');
  console.log('==================================================');
  console.log(`  Users:              ${STUDENT_COUNT}`);
  console.log(`  Student Profiles:   ${profileRecords.length}`);
  console.log(`  Skills:             ${Object.keys(skillRecords).length}`);
  console.log(`  Careers:            ${Object.keys(careerRecords).length}`);
  console.log(`  Career Skills:      ${careerSkillCount}`);
  console.log(`  Student Skills:     ${studentSkillCount}`);
  console.log(`  Roadmaps:           ${roadmapRecords.length}`);
  console.log(`  Roadmap Items:      ${roadmapItemCount}`);
  console.log(`  Projects:           ${projectRecords.length}`);
  console.log(`  Project Skills:     ${projectSkillCount}`);
  console.log(`  Recommendations:    ${recommendationCount}`);
  console.log(`  Semester Goals:     ${goalCount}`);
  console.log(`  Progress Snapshots: ${snapshotCount}`);
  console.log('==================================================');
  console.log(`\n  Demo Login:`);
  console.log(`  Email:    student01@pathforge.demo`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
