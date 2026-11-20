/**
 * Fallback content — used when the API/MongoDB is not reachable,
 * so the site still renders. The live data comes from GET /api/portfolio.
 */

export const PROFILE = {
  key: "main",
  github: "https://github.com/sahilhaq2003",
  email: "sahilhaq622@gmail.com",
  linkedin: "https://www.linkedin.com/in/sahil-haq-106595222/",
  fiverr: "",
  instagram: "",
  x: "",
  categories: ["All Projects", "Software Engineering", "Data Science", "Artificial Intelligence", "Business Intelligence"],
  portrait: "",
  hero: {
    badge: "HELLO, I’M SAHIL HAQ",
    greeting: "Engineering Software. Unlocking Intelligence Through Data.",
    name: "Sahil Haq",
    roles: ["Data & Software Engineer", "Full-Stack Developer", "Data Science Enthusiast", "AI & Machine Learning Explorer"],
    subtitle: "I’m Sahil Haq, a Data & Software Engineer and Data Science undergraduate at SLIIT, Sri Lanka. I specialize in combining software engineering, data analytics and intelligent technologies to develop practical, scalable digital solutions.",
  },
  about: {
    paragraphs: [
      "I’m a software engineering and data science enthusiast who enjoys solving real-world problems through technology.",
      "My interests span full-stack application development, data analytics, business intelligence, machine learning and intelligent automation.",
      "Through academic projects and professional software development experience, I’ve gained practical exposure to building web applications, designing databases, analyzing complex datasets and developing data-driven solutions.",
      "I believe great technology should be more than functional — it should simplify processes, support better decisions and create measurable value.",
    ],
    interests: ["Software Engineering", "Data Science & Artificial Intelligence", "Business Solutions & Automation"],
    learning: ["Advanced Deep Learning", "Predictive Modeling", "Scalable Systems"],
  },
  education: {
    degree: "BSc (Hons) in Information Technology — Specialization: Data Science",
    school: "Sri Lanka Institute of Information Technology (SLIIT)",
    dates: "Undergraduate",
    description: "Building a strong foundation in software engineering, artificial intelligence, machine learning, data analytics, databases and business intelligence.",
  },
  fiverrSteps: [
    { num: "01", title: "Message me", desc: "Share your idea and goals." },
    { num: "02", title: "Agree the scope", desc: "Clear deliverables and timeline." },
    { num: "03", title: "Build & update", desc: "Progress shared along the way." },
    { num: "04", title: "Deliver & refine", desc: "Review, revise, launch." },
  ],
  footer: {
    tagline: "Crafting intelligent software and data-driven solutions.",
  },
};

export const EXPERIENCE = [
  {
    title: "Software Engineer Intern",
    company: "Ceylon Petroleum Corporation",
    tagline: "Internship · Colombo, Western Province, Sri Lanka · On-site",
    dates: "Jul 2026 - Present",
    description: "",
    bullets: [
      "Assisted in analyzing operational and financial data to support business decision-making processes.",
      "Worked with employee salary datasets and performed data cleaning, validation, and basic analysis.",
      "Conducted exploratory data analysis (EDA) to identify trends and insights for internal reporting.",
      "Collaborated with different departments to understand workflow processes and system requirements.",
      "Gained exposure to real-world enterprise systems and data-driven business environments.",
      "Supported documentation and reporting tasks to improve organizational efficiency.",
    ],
  },
  {
    title: "Data & Software Engineer",
    company: "Dulan Progiciel",
    tagline: "Custom Software. Smarter Business.",
    dates: "[Add employment dates]",
    description: "Contributing to the development of reliable, data-driven software and business solutions by combining software engineering, database technologies and analytics.",
    bullets: [
      "Full-stack application development.",
      "Database design and development.",
      "Data analysis and visualization.",
      "Business intelligence solutions.",
      "Development of business-oriented software features.",
      "Collaboration on custom digital solutions.",
    ],
  },
];

export const RESEARCH = [
  "Applied Machine Learning",
  "AI in Healthcare and Forensic Applications",
  "Intelligent Information Retrieval and Agentic AI",
];

export const CERTIFICATIONS = [
  {
    title: "MongoDB",
    issuer: "MongoDB University",
    issued: "Apr 2026",
    credentialId: "MDB65lvawdcxk",
    credentialUrl: "https://ti-user-certificates.s3.amazonaws.com/ae62dcd7-abdc-4e90-a570-83eccba49043/0c2905fb-2a7f-44a8-a92e-2a8730f811f9-it23665248-haq-s-21f56d3d-43b0-4406-b9e6-099a64a65988-certificate.pdf",
    skills: ["MongoDB"],
  },
  {
    title: "AI/ML",
    issuer: "SLIIT",
    issued: "Dec 2025",
    credentialId: "llr153xtk7",
    credentialUrl: "https://code.sliit.org/certificates/llr153xtk7",
    skills: ["AI/ML", "Colab"],
  },
  {
    title: "Python Programming",
    issuer: "University of Moratuwa",
    issued: "Dec 2025",
    credentialId: "yNRYhLTHIN",
    credentialUrl: "https://open.uom.lk/lms/mod/customcert/verify_certificate.php",
    skills: ["Python", "Machine Learning"],
  },
  {
    title: "Analyzing and Visualizing Data with Microsoft Power BI",
    issuer: "Microsoft",
    issued: "Dec 2025",
    credentialId: "9592394",
    credentialUrl: "https://simpli-web.app.link/e/1QpzSgoW8Yb",
    skills: ["Microsoft Power BI"],
  },
  {
    title: "Python for Beginners",
    issuer: "University of Moratuwa",
    issued: "Jan 2025",
    credentialId: "llr153xtk7",
    credentialUrl: "https://open.uom.lk/lms/mod/customcert/verify_certificate.php",
    skills: ["Python"],
  },
  {
    title: "Web Design for Beginners",
    issuer: "University of Moratuwa",
    issued: "Nov 2024",
    credentialId: "DeB6W0axoJ",
    credentialUrl: "https://open.uom.lk/lms/mod/customcert/verify_certificate.php",
    skills: ["Web Design"],
  },
  {
    title: "Microsoft Certified: Azure Data Engineer Associate",
    issuer: "Microsoft",
    issued: "May 2024",
    credentialId: "",
    credentialUrl: "https://learn.microsoft.com/api/achievements/share/en-us/SahilHaq-4024/VBL4SW5M?sharingId=7E866C74CD107B1E",
    skills: ["Azure", "Data Engineering"],
  },
];

export const EXPERTISE = [
  ["⌘", "Full-Stack Development", "Designing and developing scalable, responsive web applications with modern frontend and backend technologies.", ["React", "Node.js", "Express", "MongoDB"]],
  ["◔", "Data Science & Analytics", "Transforming datasets into meaningful insights using statistical analysis, visualization and predictive modeling.", ["Python", "R", "SQL"]],
  ["✦", "AI & Machine Learning", "Exploring machine learning, intelligent automation, natural language processing and AI-powered solutions.", ["Python", "ML", "NLP", "RAG"]],
  ["▥", "Business Intelligence", "Building analytical dashboards and data solutions that help organizations understand performance and make informed decisions.", ["Power BI", "SQL", "ETL"]],
  ["◫", "Database & Backend Engineering", "Designing structured databases, REST APIs and reliable backend systems.", ["MongoDB", "SQL", "Node.js"]],
  ["⚙", "Custom Business Software", "Creating tailored digital solutions that improve business workflows, operational visibility and efficiency.", []],
].map(([icon, title, desc, tags], order) => ({ icon, title, desc, tags, order }));

export const SKILLS = {
  Frontend: ["React", "JavaScript", "HTML", "CSS", "Tailwind CSS", "Bootstrap"],
  Backend: ["Node.js", "Express.js", "Java", "Spring Boot", "REST APIs"],
  "Programming & Data": ["Python", "R", "SQL", "JavaScript"],
  Databases: ["MongoDB", "MySQL", "PostgreSQL", "SQLite"],
  "Data Science": ["Data Preprocessing", "Statistical Analysis", "Predictive Modeling", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Jupyter"],
  "Business Intelligence": ["Power BI", "Data Warehousing", "ETL", "Data Visualization"],
  AI: ["Natural Language Processing", "Retrieval-Augmented Generation", "Semantic Search"],
  Tools: ["Git", "GitHub", "VS Code", "Docker", "Vercel", "Netlify"],
};

export const GIGS = [
  ["⌘", "Full-Stack Web Applications", "Responsive React and Node.js web apps with database and API integration.", ["React", "Node.js", "MongoDB"]],
  ["◔", "Data Analysis & Visualization", "Clean, analyse and visualise your data with Python, R or SQL.", ["Python", "R", "SQL"]],
  ["▥", "Power BI Dashboards", "Interactive dashboards that turn business data into clear decisions.", ["Power BI", "ETL"]],
  ["✦", "AI & NLP Solutions", "Text analysis and AI-powered tools built around your use case.", ["NLP", "RAG", "Python"]],
].map(([icon, title, desc, tags], order) => ({ icon, title, desc, tags, order }));

// Add real delivered projects: { title, desc, tech: [], year, url }
export const FIVERR_PROJECTS = [];

export const PROJECTS = [
  {
    slug: "signalos",
    cats: ["Artificial Intelligence", "Software Engineering"],
    title: "SignalOS — Multi-Agent Social Media Intelligence Platform",
    label: "AI / NLP / Full-Stack Development",
    desc: "An intelligent social media monitoring and analysis platform incorporating autonomous agents, natural language processing, semantic retrieval, retrieval-augmented generation and human-in-the-loop review.",
    features: ["Social media content analysis", "Sentiment and emotion analysis", "Semantic retrieval", "RAG-based insights", "AI-supported report generation", "Human review workflow"],
    contrib: "Frontend Development and Insight Generation Agent.",
    tech: ["React", "Node.js", "FastAPI", "MongoDB", "NLP", "FAISS", "RAG"],
    github: "",
    demo: "",
  },
  {
    slug: "police360",
    cats: ["Software Engineering"],
    title: "Police360 — Police Information Management System",
    label: "Full-Stack Web Development",
    desc: "A full-stack police information management platform designed to digitize operational workflows, including officer records, complaints, accident reports, criminal records and case management.",
    prob: "Police operations depend on records and workflows that need centralized data management, streamlined processes and data-driven insights.",
    sol: "A full-stack, intelligent platform that modernizes police operations through centralized data management and streamlined workflows.",
    features: ["Officer records", "Complaints", "Accident reports", "Criminal records", "Case management"],
    contrib: "Officer Management Module.",
    tech: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    github: "",
    demo: "",
  },
  {
    slug: "hints7",
    cats: ["Data Science"],
    title: "Healthcare Communication & Patient Understanding Analytics",
    label: "Data Science / Healthcare Analytics",
    desc: "A data science study investigating how healthcare provider communication relates to patient understanding using 3,772 responses from the HINTS 7 dataset.",
    features: [],
    methods: ["Data preprocessing", "Statistical analysis", "Correlation analysis", "ANOVA", "Regression modeling", "Data visualization"],
    contrib: "[Add your specific contribution]",
    tech: ["R", "Statistical Modeling", "Data Analytics"],
    github: "",
    demo: "",
  },
  {
    slug: "smartcampus",
    cats: ["Software Engineering"],
    title: "Smart Campus — Integrated Campus Management System",
    label: "Full-Stack Web Development (Group Project)",
    desc: "A full-stack application for managing campus facilities, bookings, maintenance tickets and user authentication, built with a Spring Boot REST API and a React (Vite) frontend styled with Tailwind CSS.",
    prob: "Campus operations such as facility management, room bookings, maintenance requests and user access are often handled separately and are hard to coordinate.",
    sol: "A modular platform of four integrated subsystems — Facilities, Bookings, Maintenance & Tickets, and Authentication & Notifications — each owned by a team member.",
    features: ["Facility management with availability tracking and status", "Booking workflow with conflict detection, QR codes and email confirmations", "Booking analytics dashboard", "Maintenance tickets with priority-based SLA timers and file attachments", "Technician assignment and performance analytics", "Google OAuth and email/password login with JWT and role-based access", "Real-time in-app notifications (SSE) and email notifications"],
    arch: "Spring Boot 3.x REST API backend with PostgreSQL, and a React 18 + Vite frontend using Tailwind CSS; Supabase storage for attachments, ZXing for QR codes.",
    contrib: "[Add your specific module — the repository README splits work across four members]",
    tech: ["Java", "Spring Boot", "React", "Vite", "Tailwind CSS", "PostgreSQL", "JWT", "Google OAuth"],
    github: "https://github.com/sahilhaq2003/it3030-paf-2026-smart-campus-group113",
    demo: "",
  },
].map((p, order) => ({ ...p, order }));
