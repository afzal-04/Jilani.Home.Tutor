// src/lib/firestore.ts
import {
  collection, addDoc, getDocs, doc,
  updateDoc, setDoc, getDoc, deleteDoc,
  query, orderBy, serverTimestamp, increment,
} from 'firebase/firestore';
import { getDbInstance } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus  = 'new' | 'contacted' | 'converted' | 'closed';
export type ClassStatus = 'active' | 'paused' | 'completed';

export interface ParentLead {
  id?: string;
  name: string;
  phone: string;
  area: string;
  class: string;
  subject: string;
  status: LeadStatus;
  createdAt?: { seconds: number };
}

export interface TutorLead {
  id?: string;
  name: string;
  phone: string;
  area: string;
  qualification: string;
  subjects: string;
  classes: string;
  gender?: string;
  status: LeadStatus;
  createdAt?: { seconds: number };
}

export interface SiteConfig {
  offerBanner: string;
  whatsappNumber: string;
  heroSubtext: string;
  address: string;
}

export interface FeeRecord {
  id?: string;
  tutorName: string;
  parentName: string;
  subject: string;
  classLevel: string;
  parentFee: number;
  tutorFee: number;
  profit: number;
  month: string;
  paymentStatus: 'pending' | 'received' | 'paid';
  notes: string;
  createdAt?: { seconds: number };
}

export interface ClassRecord {
  id?: string;
  tutorName: string;
  tutorPhone: string;
  parentName: string;
  parentPhone: string;
  subject: string;
  classLevel: string;
  classesPerWeek: number;
  startDate: string;
  status: ClassStatus;
  area: string;
  notes: string;
  createdAt?: { seconds: number };
}

// ─── Parents ──────────────────────────────────────────────────────────────────

export async function registerParent(data: Omit<ParentLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(getDbInstance(), 'parents'), {
    ...data, status: 'new' as LeadStatus, createdAt: serverTimestamp(),
  });
}

export async function getAllParents(): Promise<ParentLead[]> {
  const snap = await getDocs(query(collection(getDbInstance(), 'parents'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ParentLead));
}

// ─── Tutors ───────────────────────────────────────────────────────────────────

export async function registerTutor(data: Omit<TutorLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(getDbInstance(), 'tutors'), {
    ...data, status: 'new' as LeadStatus, createdAt: serverTimestamp(),
  });
}

export async function getAllTutors(): Promise<TutorLead[]> {
  const snap = await getDocs(query(collection(getDbInstance(), 'tutors'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorLead));
}

// ─── Status Update ────────────────────────────────────────────────────────────

export async function updateLeadStatus(col: 'parents' | 'tutors', id: string, status: LeadStatus) {
  return updateDoc(doc(getDbInstance(), col, id), { status });
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const snap = await getDoc(doc(getDbInstance(), 'config', 'site'));
  return snap.exists() ? (snap.data() as SiteConfig) : null;
}

export async function saveSiteConfig(config: SiteConfig) {
  return setDoc(doc(getDbInstance(), 'config', 'site'), {
    ...config, updatedAt: serverTimestamp(),
  });
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export async function getAllFees(): Promise<FeeRecord[]> {
  const snap = await getDocs(query(collection(getDbInstance(), 'fees'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeeRecord));
}

export async function addFeeRecord(data: Omit<FeeRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(getDbInstance(), 'fees'), {
    ...data, profit: data.parentFee - data.tutorFee, createdAt: serverTimestamp(),
  });
}

export async function updateFeeRecord(id: string, data: Partial<FeeRecord>) {
  const updated = { ...data };
  if (data.parentFee !== undefined && data.tutorFee !== undefined) {
    updated.profit = data.parentFee - data.tutorFee;
  }
  return updateDoc(doc(getDbInstance(), 'fees', id), updated);
}

export async function deleteFeeRecord(id: string) {
  return deleteDoc(doc(getDbInstance(), 'fees', id));
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function getAllClasses(): Promise<ClassRecord[]> {
  const snap = await getDocs(query(collection(getDbInstance(), 'classes'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassRecord));
}

export async function addClassRecord(data: Omit<ClassRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(getDbInstance(), 'classes'), {
    ...data, createdAt: serverTimestamp(),
  });
}

export async function updateClassRecord(id: string, data: Partial<ClassRecord>) {
  return updateDoc(doc(getDbInstance(), 'classes', id), data);
}

export async function deleteClassRecord(id: string) {
  return deleteDoc(doc(getDbInstance(), 'classes', id));
}

// ─── Visitor Analytics ────────────────────────────────────────────────────────

export interface VisitorStats {
  totalViews: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUnique: number;
  weekViews: number;
  daily: { date: string; views: number; unique: number }[];
}

/** Called on every page load. Increments counters in Firestore. */
export async function trackVisit(): Promise<void> {
  try {
    const db = getDbInstance();
    const today = new Date().toISOString().split('T')[0]; // e.g. "2026-05-03"
    const isReturning =
      typeof window !== 'undefined' && localStorage.getItem('jht_visited') === '1';

    const summaryRef = doc(db, 'analytics', 'summary');
    const dailyRef   = doc(db, 'analytics', `daily_${today}`);

    const writes: Promise<void>[] = [
      setDoc(summaryRef, { totalViews: increment(1) }, { merge: true }),
      setDoc(dailyRef,   { views: increment(1), date: today }, { merge: true }),
    ];

    if (!isReturning) {
      writes.push(setDoc(summaryRef, { uniqueVisitors: increment(1) }, { merge: true }));
      writes.push(setDoc(dailyRef,   { unique: increment(1) }, { merge: true }));
      if (typeof window !== 'undefined') localStorage.setItem('jht_visited', '1');
    }

    await Promise.all(writes);
  } catch {
    // Never break the page if analytics fails
  }
}

/** Fetches all visitor stats for the admin dashboard. */
export async function getVisitorStats(): Promise<VisitorStats> {
  const db = getDbInstance();

  const summarySnap = await getDoc(doc(db, 'analytics', 'summary'));
  const summary = summarySnap.exists()
    ? summarySnap.data()
    : { totalViews: 0, uniqueVisitors: 0 };

  // Build last 14 days and fetch in parallel
  const dayKeys: { key: string; label: string }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayKeys.push({
      key:   d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    });
  }

  const daySnaps = await Promise.all(
    dayKeys.map(({ key }) => getDoc(doc(db, 'analytics', `daily_${key}`)))
  );

  const daily = daySnaps.map((snap, i) => ({
    date:   dayKeys[i].label,
    views:  snap.exists() ? (snap.data().views  || 0) : 0,
    unique: snap.exists() ? (snap.data().unique || 0) : 0,
  }));

  const today     = daily[daily.length - 1];
  const weekViews = daily.slice(-7).reduce((s, d) => s + d.views, 0);

  return {
    totalViews:     summary.totalViews     || 0,
    uniqueVisitors: summary.uniqueVisitors || 0,
    todayViews:     today.views,
    todayUnique:    today.unique,
    weekViews,
    daily,
  };
}