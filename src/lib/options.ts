// Shared dropdown options — single source of truth for forms + admin

export const PARENT_CLASSES = [
  'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8',
  'Class 9', 'Class 10 (Board)',
  'Class 11', 'Class 12 (Board)',
  'Competitive Exam (JEE / NEET)',
  'Competitive Exam (Government Job)',
  'Summer Classes',
  'Drawing / Art Classes',
  'Music / Singing Classes',
  'Dance Classes',
  'Other',
] as const;

export const PARENT_SUBJECTS = [
  'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Computer Science',
  'Maths + Science (Both)', 'All Subjects (Primary)',
  'All Subjects (Secondary)', 'JEE Preparation', 'NEET Preparation',
  'Drawing / Art', 'Music / Singing', 'Dance', 'Other',
] as const;

export const RAIPUR_AREAS = [
  'Shankar Nagar', 'Civil Lines', 'Pandri', 'Telibandha', 'Tatibandh',
  'Devendra Nagar', 'Raipur Station Road', 'Pachpedi Naka', 'Avanti Vihar',
  'Byron Bazar', 'Mowa', 'Khamardih', 'Fafadih', 'Rajendra Nagar',
  'Kabir Nagar', 'Gopal Nagar', 'New Rajendra Nagar', 'Shanti Nagar',
  'Other Area',
] as const;

export const TUTOR_CLASSES = [
  'Pre-Primary (Nursery / LKG / UKG)',
  'Class 1–5 (Primary)',
  'Class 6–8 (Middle)',
  'Class 9–10 (Board)',
  'Class 11–12 (Senior)',
  'Competitive Exams',
  'Summer / Activity Classes',
] as const;

export const TUTOR_SUBJECTS = [
  'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Computer Science',
  'Accountancy / Commerce', 'Economics',
  'JEE Coaching', 'NEET Coaching',
  'Drawing / Art', 'Music / Singing', 'Dance',
] as const;

export const QUALIFICATIONS = [
  '12th Pass', 'Pursuing Graduation',
  'B.A', 'B.Sc', 'B.Com', 'B.Tech / B.E', 'BCA', 'B.Ed',
  'M.A', 'M.Sc', 'M.Com', 'M.Tech', 'MBA', 'PhD', 'Other',
] as const;

export const GENDERS = ['Male', 'Female', 'Other'] as const;

/** Admin fee/class forms use the same class & subject lists as parent registration */
export const ALL_CLASSES = [...PARENT_CLASSES];
export const ALL_SUBJECTS = [
  'Maths', 'Science', 'Physics', 'Chemistry', 'Biology',
  'English', 'Hindi', 'Social Science', 'Computer Science',
  'Accountancy / Commerce', 'Economics',
  'JEE Coaching', 'NEET Coaching',
  'Drawing / Art', 'Music / Singing', 'Dance',
  'All Subjects', 'Other',
];

export const DEFAULT_WHATSAPP = '917999854628';
export const DEFAULT_WHATSAPP_HREF = `https://wa.me/${DEFAULT_WHATSAPP}`;
