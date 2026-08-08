import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Home Tutor in Raipur | Jilani Home Tutor',
  description: 'Book verified 1-on-1 home tutors in Raipur for Class 1–12, Maths, Science, Physics, Chemistry, and competitive exams. 1st Demo Class FREE!',
};

export default function FindTutorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
