// This file contains placeholder data for a Job Application system.


const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'Admin',
    email: 'admin@jobportal.com',
    password: 'securepassword', 
  },
];

const applicants = [
  {
    id: "a3d2f7c0-68b0-4f9b-93cb-7d4a741f8eaa", 
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane.doe@example.com',
    phone: '555-123-4567',
    resume_url: '/resumes/jane-doe.pdf',
    status: 'pending',
    application_date: '2025-06-10',
  },
  {
    id: "b134a7e0-9b60-4dd7-82b0-3ef4590c2a4e", 
    first_name: 'John',
    last_name: 'Coal',
    email: 'john.smith@example.com',
    phone: '555-987-6543',
    resume_url: '/resumes/john-smith.pdf',
    status: 'accepted',
    application_date: '2025-06-12',
  },
  {
    id: "a7e8f7c0-68b0-4f9b-93cb-7d4a741f8eaa", // ✅ valid
    first_name: 'Emily',
    last_name: 'Johnson',
    email: 'emily.j@example.com',
    phone: '555-555-1212',
    resume_url: '/resumes/emily-johnson.pdf',
    status: 'rejected',
    application_date: '2025-06-01',
  },
];

const onboarding = [
  {
    applicant_id: 'a7e8f7c0-68b0-4f9b-93cb-7d4a741f8eaa', // ✅ matches Emily
    first_name: 'Emily',
    middle_name: 'Johnson',
    last_name: 'Smith',
    mother_MaidenName: 'Grace',
    address: {
      street: '',
      city: '',
      state: '',
      zip_code: '',
    },
    ssn: '123-12-9484',
    bank_account: {
      account_number: '987654321',
      routing_number: '123456789',
      bank_name: 'Bank of America',
    },
    id_documents: {
      front_image_url: '/ids/john-smith-front.png',
      back_image_url: '/ids/john-smith-back.png',
    },
    w2_form: '/',
    onboarding_completed: true,
    onboarding_date: '2025-06-20',
  },
];


const monthlyStats = [
  { month: 'Apr', applications: 18 },
  { month: 'May', applications: 27 },
  { month: 'Jun', applications: 35 },
];

export { users, applicants, onboarding, monthlyStats };
