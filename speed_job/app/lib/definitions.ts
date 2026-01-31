// types/definitions.ts

// Full applicant (with resume file reference)
export type Applicant = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_url: string; // File URL or download path
  resume_mime: string;
  status: 'pending' | 'accepted' | 'rejected';
  application_date: string; // ISO string
};

// Preview used in list views
export type ApplicantPreview = {
  resumes_url: string | undefined;
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  application_date: string;
};

// Used when submitting application form
export type ApplicationForm = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  resume_file: Buffer; // still binary for upload
  resume_mime: string;
  status: 'pending' | 'accepted' | 'rejected';
  application_date: string;
};

// Onboarding form input (frontend -> backend)
export type OnboardingForm = {
  applicant_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  motherMaidenName: string;
  ssn: string;
  date_of_birth: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  bank_account: {
    account_number: string;
    routing_number: string;
    bank_name: string;
  };
  id_documents: {
    front_image_url: string;
    back_image_url: string;
  };
  w2_form_url: string;
};

// DB or API response object
export type ApplicantOnboarding = {
  applicant_id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  motherMaidenName: string;
  ssn: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip_code: string;
  };
  bank_account: {
    account_number: string;
    routing_number: string;
    bank_name: string;
  };
  id_documents: {
    front_image_url: string;
    back_image_url: string;
  };
  w2_form_url: string;
  onboarding_completed: boolean;
  onboarding_date?: string;
};

// Used for onboarding dashboard table
export type OnboardingDashboardRecord = {
  applicant_id: string;
  applicant_first_name: string;
  applicant_last_name: string;
  email: string;
  phone: string;
  resumes_url: string;
  status: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  bank_name: string;
  account_number: string;
  routing_number: string;
  front_image_url: string;
  back_image_url: string;
  w2_form_url: string;
  onboarding_completed: boolean;
  onboarding_date: string;
};
