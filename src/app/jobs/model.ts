interface Job {
  _id: string;
  name: string;
  skills: string[];
  company: { _id: string; name: string; logo: string };
  location: string;
  salary: number;
  quantity: number;
  level: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Province {
  Id: string;
  Name: string;
  Districts: District[];
}

interface District {
  Id: string;
  Name: string;
  Wards: Ward[];
}

interface Ward {
  Id?: string;
  Name?: string;
  Level: string;
}

const mockJobs: Job[] = [
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
];
