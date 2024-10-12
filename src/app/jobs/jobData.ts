export interface Job {
  _id: string;
  name: string;
  skills: string[];
  company: { _id: string; name: string; logo: string };
  location: string;
  salary: number;
  quantity: number;
  level: string;
  // description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  // createdBy: {
  //   _id: string;
  //   email: string;
  // };
  // isDeleted: boolean;
  // deletedAt: string | null;
  // createdAt: string;
  // updatedAt: string;
}

export const mockJobs: Job[] = [
  {
    _id: '1',
    name: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'],
    company: { _id: '1', name: 'TechCorp', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 10000000,
    quantity: 3,
    level: 'Junior',
    startDate: '2024-10-01',
    endDate: '2024-12-01',
    isActive: true,
  },
  {
    _id: '2',
    name: 'Backend Developer',
    skills: ['Node.js', 'Express', 'MongoDB'],
    company: { _id: '2', name: 'DevCompany', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 12000000,
    quantity: 2,
    level: 'Senior',
    startDate: '2024-09-15',
    endDate: '2024-11-15',
    isActive: false,
  },
  {
    _id: '3',
    name: 'Full Stack Developer',
    skills: ['React', 'Node.js', 'GraphQL'],
    company: { _id: '3', name: 'Innovatech', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 15000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-08-01',
    endDate: '2024-10-30',
    isActive: true,
  },
  {
    _id: '4',
    name: 'Mobile Developer',
    skills: ['React Native', 'iOS', 'Android'],
    company: { _id: '4', name: 'MobileTech', logo: 'https://via.placeholder.com/150' },
    location: 'Hue',
    salary: 11000000,
    quantity: 1,
    level: 'Junior',
    startDate: '2024-09-01',
    endDate: '2024-12-31',
    isActive: true,
  },
  {
    _id: '5',
    name: 'DevOps Engineer',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    company: { _id: '5', name: 'CloudNet', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 20000000,
    quantity: 2,
    level: 'Senior',
    startDate: '2024-10-01',
    endDate: '2024-11-01',
    isActive: true,
  },
  {
    _id: '6',
    name: 'UI/UX Designer',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    company: { _id: '6', name: 'DesignPro', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 9000000,
    quantity: 1,
    level: 'Mid-level',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    isActive: false,
  },
  {
    _id: '7',
    name: 'Data Analyst',
    skills: ['SQL', 'Python', 'Tableau'],
    company: { _id: '7', name: 'Data Insights', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 13000000,
    quantity: 3,
    level: 'Mid-level',
    startDate: '2024-08-01',
    endDate: '2024-10-01',
    isActive: true,
  },
  {
    _id: '8',
    name: 'Project Manager',
    skills: ['Agile', 'Scrum', 'Leadership'],
    company: { _id: '8', name: 'Innovatech', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 18000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    isActive: false,
  },
  {
    _id: '9',
    name: 'QA Engineer',
    skills: ['Selenium', 'Cypress', 'Manual Testing'],
    company: { _id: '9', name: 'TestCorp', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 10000000,
    quantity: 2,
    level: 'Junior',
    startDate: '2024-09-10',
    endDate: '2024-11-10',
    isActive: true,
  },
  {
    _id: '10',
    name: 'Cybersecurity Specialist',
    skills: ['Penetration Testing', 'Network Security', 'Firewalls'],
    company: { _id: '10', name: 'SecureNet', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 22000000,
    quantity: 2,
    level: 'Senior',
    startDate: '2024-08-20',
    endDate: '2024-10-20',
    isActive: true,
  },
  {
    _id: '11',
    name: 'System Administrator',
    skills: ['Linux', 'Windows Server', 'AWS'],
    company: { _id: '11', name: 'SysOps', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 12000000,
    quantity: 1,
    level: 'Mid-level',
    startDate: '2024-09-05',
    endDate: '2024-11-05',
    isActive: true,
  },
  {
    _id: '12',
    name: 'Database Administrator',
    skills: ['MySQL', 'PostgreSQL', 'NoSQL'],
    company: { _id: '12', name: 'DB Solutions', logo: 'https://via.placeholder.com/150' },
    location: 'Hue',
    salary: 14000000,
    quantity: 1,
    level: 'Mid-level',
    startDate: '2024-07-20',
    endDate: '2024-09-20',
    isActive: false,
  },
  {
    _id: '13',
    name: 'Machine Learning Engineer',
    skills: ['Python', 'TensorFlow', 'Scikit-learn'],
    company: { _id: '13', name: 'AI Labs', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 25000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-08-01',
    endDate: '2024-10-30',
    isActive: true,
  },
  {
    _id: '14',
    name: 'Technical Writer',
    skills: ['Documentation', 'API Writing', 'Markdown'],
    company: { _id: '14', name: 'TechDocs', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 8000000,
    quantity: 2,
    level: 'Junior',
    startDate: '2024-10-01',
    endDate: '2024-12-01',
    isActive: true,
  },
  {
    _id: '15',
    name: 'Network Engineer',
    skills: ['Cisco', 'Networking', 'VPN'],
    company: { _id: '15', name: 'NetWorks', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 17000000,
    quantity: 2,
    level: 'Mid-level',
    startDate: '2024-08-01',
    endDate: '2024-10-31',
    isActive: true,
  },
  {
    _id: '16',
    name: 'Product Owner',
    skills: ['Product Management', 'Scrum', 'Agile'],
    company: { _id: '16', name: 'Innovatech', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 23000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    isActive: false,
  },
  {
    _id: '17',
    name: 'Cloud Engineer',
    skills: ['AWS', 'Azure', 'Google Cloud'],
    company: { _id: '17', name: 'CloudNet', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 20000000,
    quantity: 2,
    level: 'Senior',
    startDate: '2024-09-01',
    endDate: '2024-11-01',
    isActive: true,
  },
  {
    _id: '18',
    name: 'HR Manager',
    skills: ['Recruiting', 'HR Policies', 'Leadership'],
    company: { _id: '18', name: 'PeopleFirst', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 18000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-07-01',
    endDate: '2024-10-01',
    isActive: false,
  },
  {
    _id: '19',
    name: 'Business Analyst',
    skills: ['SQL', 'Business Intelligence', 'Communication'],
    company: { _id: '19', name: 'BizInsight', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 15000000,
    quantity: 1,
    level: 'Mid-level',
    startDate: '2024-08-01',
    endDate: '2024-11-01',
    isActive: true,
  },
  {
    _id: '20',
    name: 'Blockchain Developer',
    skills: ['Solidity', 'Smart Contracts', 'Ethereum'],
    company: { _id: '20', name: 'BlockTech', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 25000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-09-01',
    endDate: '2024-12-01',
    isActive: true,
  },
  {
    _id: '21',
    name: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'Statistics'],
    company: { _id: '4', name: 'DataSolutions', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 14000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-09-01',
    endDate: '2024-11-30',
    isActive: true,
  },
  {
    _id: '22',
    name: 'UX/UI Designer',
    skills: ['Figma', 'Adobe XD', 'Sketch'],
    company: { _id: '5', name: 'DesignPro', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 11000000,
    quantity: 2,
    level: 'Mid-Level',
    startDate: '2024-10-15',
    endDate: '2024-12-15',
    isActive: true,
  },
  {
    _id: '23',
    name: 'Mobile Developer',
    skills: ['React Native', 'Swift', 'Kotlin'],
    company: { _id: '6', name: 'AppMakers', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 13000000,
    quantity: 1,
    level: 'Junior',
    startDate: '2024-11-01',
    endDate: '2025-01-01',
    isActive: true,
  },
  {
    _id: '24',
    name: 'Network Engineer',
    skills: ['Cisco', 'Network Security', 'TCP/IP'],
    company: { _id: '7', name: 'NetSolutions', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 12000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-09-20',
    endDate: '2024-11-20',
    isActive: false,
  },
  {
    _id: '25',
    name: 'Software Tester',
    skills: ['Selenium', 'Manual Testing', 'Automation'],
    company: { _id: '8', name: 'QualityFirst', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 9000000,
    quantity: 2,
    level: 'Junior',
    startDate: '2024-09-30',
    endDate: '2024-12-30',
    isActive: true,
  },
  {
    _id: '26',
    name: 'Cloud Engineer',
    skills: ['AWS', 'Azure', 'DevOps'],
    company: { _id: '9', name: 'CloudMasters', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 16000000,
    quantity: 1,
    level: 'Senior',
    startDate: '2024-10-10',
    endDate: '2025-01-10',
    isActive: true,
  },
  {
    _id: '27',
    name: 'Business Analyst',
    skills: ['Data Analysis', 'SQL', 'Excel'],
    company: { _id: '10', name: 'BizInsight', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 11000000,
    quantity: 2,
    level: 'Mid-Level',
    startDate: '2024-08-15',
    endDate: '2024-11-15',
    isActive: true,
  },
  {
    _id: '28',
    name: 'SEO Specialist',
    skills: ['SEO', 'Google Analytics', 'Content Marketing'],
    company: { _id: '11', name: 'SEOExperts', logo: 'https://via.placeholder.com/150' },
    location: 'Hanoi',
    salary: 9500000,
    quantity: 3,
    level: 'Junior',
    startDate: '2024-09-05',
    endDate: '2024-12-05',
    isActive: false,
  },
  {
    _id: '29',
    name: 'Content Writer',
    skills: ['Copywriting', 'Blogging', 'SEO'],
    company: { _id: '12', name: 'ContentCreators', logo: 'https://via.placeholder.com/150' },
    location: 'Ho Chi Minh City',
    salary: 8000000,
    quantity: 2,
    level: 'Junior',
    startDate: '2024-10-01',
    endDate: '2025-01-01',
    isActive: true,
  },
  {
    _id: '30',
    name: 'Graphic Designer',
    skills: ['Photoshop', 'Illustrator', 'Creativity'],
    company: { _id: '13', name: 'VisualDesign', logo: 'https://via.placeholder.com/150' },
    location: 'Da Nang',
    salary: 9000000,
    quantity: 1,
    level: 'Mid-Level',
    startDate: '2024-09-20',
    endDate: '2024-11-20',
    isActive: true,
  },
];