// Sample job data. Each row: title, company, location, min, max, type, experience, mode, category, days ago, skills
// Salary is in LPA (lakhs per year); for internships it is thousands per month.
const CATS = ["Software", "Data", "Design", "Marketing", "Business"];
const LEVELS = ["Fresher", "Junior", "Mid", "Senior"];
const RAW = [
    ["Software Developer", "Microsoft", "Bengaluru", 8, 14, "Full Time", "Mid", "Hybrid", "Software", 1, ["Java", "Spring Boot", "SQL"]],
    ["Frontend Developer", "PixelWorks", "Pune", 6, 11, "Full Time", "Junior", "Hybrid", "Software", 2, ["HTML", "CSS", "JavaScript", "TypeScript"]],
    ["Backend Developer", "Amazon", "Hyderabad", 10, 18, "Full Time", "Mid", "On-site", "Software", 3, ["Node.js", "MongoDB", "AWS"]],
    ["Data Analyst", "InsightIQ", "Gurugram", 5, 9, "Full Time", "Junior", "Hybrid", "Data", 2, ["SQL", "Excel", "Power BI"]],
    ["Data Scientist", "DeepLens", "Bengaluru", 15, 26, "Full Time", "Senior", "Remote", "Data", 4, ["Python", "Machine Learning", "Statistics"]],
    ["Machine Learning Intern", "NeuralPath", "Remote", 25, 35, "Internship", "Fresher", "Remote", "Data", 1, ["Python", "TensorFlow", "Pandas"]],
    ["UI/UX Designer", "DesignHive", "Mumbai", 7, 12, "Full Time", "Mid", "Hybrid", "Design", 5, ["Figma", "Prototyping", "User Research"]],
    ["Digital Marketing Intern", "GrowthLoop", "Delhi", 12, 18, "Internship", "Fresher", "On-site", "Marketing", 2, ["SEO", "Social Media", "Analytics"]],
    ["Business Analyst", "FinEdge", "Mumbai", 9, 15, "Full Time", "Mid", "On-site", "Business", 6, ["Requirements", "SQL", "Jira"]],
    ["Full Stack Developer", "Flipkart", "Noida", 9, 16, "Full Time", "Mid", "Hybrid", "Software", 3, ["JavaScript", "Node.js", "PostgreSQL"]],
    ["DevOps Engineer", "InfraLabs", "Chennai", 12, 20, "Full Time", "Senior", "Hybrid", "Software", 7, ["Docker", "Kubernetes", "CI/CD"]],
    ["Content Marketer", "BrandBloom", "Remote", 4, 7, "Part Time", "Junior", "Remote", "Marketing", 4, ["Copywriting", "SEO", "Editing"]],
    ["QA Engineer", "TestTribe", "Bhubaneswar", 5, 9, "Contract", "Junior", "On-site", "Software", 8, ["Selenium", "Java", "API Testing"]],
    ["Product Designer", "Orbit Studio", "Bengaluru", 14, 22, "Full Time", "Senior", "Remote", "Design", 1, ["Figma", "Design Systems", "Accessibility"]],
    ["Business Analytics Intern", "Flipkart", "Hyderabad", 20, 30, "Internship", "Fresher", "Hybrid", "Business", 3, ["Excel", "SQL", "Presentation"]],
    ["Mobile App Developer", "Amazon", "Pune", 8, 15, "Contract", "Mid", "Hybrid", "Software", 5, ["Flutter", "Dart", "Firebase"]],
    ["Cloud Architect", "TCS", "Bengaluru", 25, 40, "Full Time", "Senior", "Hybrid", "Software", 1, ["AWS", "Azure", "Terraform"]],
    ["Java Developer", "Wipro", "Chennai", 6, 12, "Full Time", "Junior", "On-site", "Software", 2, ["Java", "Hibernate", "REST API"]],
    ["Cyber Security Analyst", "Microsoft", "Hyderabad", 9, 16, "Full Time", "Mid", "Hybrid", "Software", 3, ["Networking", "SIEM", "Ethical Hacking"]],
    ["React Developer", "Infosys", "Kolkata", 7, 13, "Full Time", "Mid", "Remote", "Software", 1, ["React", "Redux", "JavaScript"]],
    ["Software Trainee", "TCS", "Pune", 4, 6, "Full Time", "Fresher", "On-site", "Software", 4, ["C++", "Java", "SQL"]],
    ["Data Engineer", "Wipro", "Bengaluru", 14, 24, "Full Time", "Senior", "Hybrid", "Data", 2, ["Spark", "Python", "Airflow"]],
    ["Power BI Developer", "Infosys", "Mumbai", 6, 11, "Full Time", "Junior", "Hybrid", "Data", 5, ["Power BI", "DAX", "SQL"]],
    ["Data Science Intern", "Microsoft", "Remote", 20, 30, "Internship", "Fresher", "Remote", "Data", 2, ["Python", "Pandas", "Statistics"]],
    ["Graphic Designer", "Creative Minds Ltd", "Delhi", 4, 8, "Full Time", "Junior", "On-site", "Design", 3, ["Photoshop", "Illustrator", "Branding"]],
    ["UX Research Intern", "Creative Minds Ltd", "Bengaluru", 15, 22, "Internship", "Fresher", "Hybrid", "Design", 1, ["User Research", "Figma", "Surveys"]],
    ["SEO Specialist", "BrightReach Media", "Gurugram", 5, 9, "Full Time", "Junior", "Hybrid", "Marketing", 4, ["SEO", "Google Analytics", "Content"]],
    ["Brand Manager", "BrightReach Media", "Mumbai", 14, 22, "Full Time", "Senior", "On-site", "Marketing", 6, ["Branding", "Campaigns", "Strategy"]],
    ["HR Executive", "Infosys", "Noida", 4, 7, "Full Time", "Junior", "On-site", "Business", 2, ["Recruitment", "Communication", "Excel"]],
    ["Financial Analyst", "Wipro", "Mumbai", 8, 14, "Full Time", "Mid", "Hybrid", "Business", 3, ["Finance", "Excel", "Reporting"]],
    ["Project Manager", "TCS", "Hyderabad", 18, 30, "Full Time", "Senior", "Hybrid", "Business", 5, ["Agile", "Jira", "Leadership"]],
    ["Android Developer", "Microsoft", "Bengaluru", 7, 13, "Full Time", "Junior", "Hybrid", "Software", 2, ["Kotlin", "Android", "Firebase"]],
    ["Sales Executive", "Flipkart", "Kolkata", 3, 6, "Full Time", "Fresher", "On-site", "Business", 1, ["Sales", "Communication", "CRM"]]
];
const JOBS = RAW.map((r, i) => ({ id: i + 1, title: r[0], company: r[1], loc: r[2], min: r[3], max: r[4], type: r[5], exp: r[6], mode: r[7], cat: r[8], days: r[9], skills: r[10] }));
const sal = j => j.type == "Internship" ? `₹${j.min}k–${j.max}k / month` : `₹${j.min}–${j.max} LPA`;
const annual = j => j.type == "Internship" ? j.max * 12 / 100 : j.max; // used for salary sort/filter
const ago = d => d == 1 ? "1 day ago" : d + " days ago";
const detailsOf = j => ({
    desc: `${j.company} is hiring a ${j.title} for its ${j.cat} team in ${j.loc}. You will work with cross-functional teammates to build, ship and improve products used by thousands of customers.`,
    resp: ["Own tasks end to end, from planning to release", "Collaborate with product, design and engineering peers", "Deliver clean, documented and well-tested work", "Share ideas in reviews and sprint discussions"],
    req: [`${j.exp}-level experience relevant to the ${j.title} role`, `Hands-on skills in ${j.skills.join(", ")}`, "Clear communication and problem solving", "Bachelor's degree or equivalent practical experience"],
    ben: ["Health insurance", "Flexible working hours", "Learning and certification budget", "Paid leave and holidays"],
    about: `${j.company} is a fast-growing Indian company building ${j.cat.toLowerCase()} solutions, with teams across the country.`
});
const DEF_PROFILE = { name: "Aarav Sharma", email: "aarav.sharma@example.com", phone: "9876543210", loc: "Bengaluru, India", about: "Curious computer science graduate who enjoys building useful web products and learning new tools.", skills: "JavaScript, Python, SQL, Figma", edu: "B.Tech in Computer Science, 2025", exp: "Fresher - 2 internships", resume: "", photo: "" };

// Top Hiring Companies: photo + details (sizes are approximate). Change any value here.
const COMPANIES = [
    { name: "TCS", full: "Tata Consultancy Services", industry: "IT Services & Consulting", hq: "Mumbai", size: "5 lakh+ employees", founded: 1968,
      img: "https://c.ndtvimg.com/2026-07/795neqoo_tcs_625x300_10_July_26.png?im=FitAndFill,algorithm=dnn,width=1600,height=900",
      about: "One of India's largest IT companies, serving clients in banking, retail, telecom and more across 50+ countries." },
    { name: "Infosys", full: "Infosys Limited", industry: "Digital Services & Consulting", hq: "Bengaluru", size: "3 lakh+ employees", founded: 1981,
      img: "https://media.telanganatoday.com/wp-content/uploads/2026/04/Infosys.jpg",
      about: "Global leader in next-generation digital services, known for its large campuses and strong fresher training programs." },
    { name: "Microsoft", full: "Microsoft India", industry: "Software & Cloud", hq: "Hyderabad (India HQ)", size: "2 lakh+ employees worldwide", founded: 1975,
      img: "https://media.istockphoto.com/id/1835205195/photo/microsoft-name-on-the-french-office-building-in-issy-les-moulineaux-near-paris-france.jpg?s=612x612&w=0&k=20&c=j8OdzP8z8xCDnngGKLk4KogjLAINzackvSXqBOe6Mas=",
      about: "Builds Windows, Azure, Office and AI products. Its India development centre works on cloud and security." },
    { name: "Flipkart", full: "Flipkart Internet", industry: "E-commerce", hq: "Bengaluru", size: "20,000+ employees", founded: 2007,
      img: "https://img.etimg.com/thumb/msid-64092726,width-480,height-360,imgsize-193486,resizemode-75/a-look-back.jpg",
      about: "India's homegrown online marketplace, hiring engineers, analysts and designers for shopping at scale." },
    { name: "Amazon", full: "Amazon India", industry: "E-commerce & Cloud (AWS)", hq: "Bengaluru (India HQ)", size: "15 lakh+ employees worldwide", founded: 1994,
      img: "https://thumbs.dreamstime.com/b/amazon-headquarters-silicon-valley-november-sunnyvale-ca-usa-located-san-francisco-bay-area-130785803.jpg",
      about: "Runs the Amazon marketplace and AWS cloud, with big engineering teams in Bengaluru, Hyderabad and Chennai." },
    { name: "Wipro", full: "Wipro Limited", industry: "IT Services & Consulting", hq: "Bengaluru", size: "2 lakh+ employees", founded: 1945,
      img: "https://thumbs.dreamstime.com/b/bucharest-romania-july-logo-indian-multinational-wipro-technologies-seen-top-building-image-editorial-284838078.jpg",
      about: "Global IT, consulting and business process company with a strong focus on cloud, data and engineering." }
];
