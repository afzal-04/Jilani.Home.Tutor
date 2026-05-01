// src/lib/firestore.ts
import {
  collection, addDoc, getDocs, doc,
  updateDoc, setDoc, getDoc, deleteDoc,
  query, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = 'new' | 'contacted' | 'converted' | 'closed';
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

// NEW: Fee record — one row per tutor-parent engagement
export interface FeeRecord {
  id?: string;
  tutorName: string;
  parentName: string;
  subject: string;
  classLevel: string;           // e.g. Class 9–10
  parentFee: number;            // what parent pays you (₹/month)
  tutorFee: number;             // what you pay tutor (₹/month)
  profit: number;               // auto = parentFee - tutorFee
  month: string;                // e.g. "April 2025"
  paymentStatus: 'pending' | 'received' | 'paid';
  notes: string;
  createdAt?: { seconds: number };
}

// NEW: Class assignment record
export interface ClassRecord {
  id?: string;
  tutorName: string;
  tutorPhone: string;
  parentName: string;
  parentPhone: string;
  subject: string;
  classLevel: string;
  classesPerWeek: number;
  startDate: string;            // ISO date string
  status: ClassStatus;
  area: string;
  notes: string;
  createdAt?: { seconds: number };
}

// ─── Parents ──────────────────────────────────────────────────────────────────

export async function registerParent(data: Omit<ParentLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(db, 'parents'), {
    ...data,
    status: 'new' as LeadStatus,
    createdAt: serverTimestamp(),
  });
}

export async function getAllParents(): Promise<ParentLead[]> {
  const snap = await getDocs(query(collection(db, 'parents'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ParentLead));
}

// ─── Tutors ───────────────────────────────────────────────────────────────────

export async function registerTutor(data: Omit<TutorLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(db, 'tutors'), {
    ...data,
    status: 'new' as LeadStatus,
    createdAt: serverTimestamp(),
  });
}

export async function getAllTutors(): Promise<TutorLead[]> {
  const snap = await getDocs(query(collection(db, 'tutors'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorLead));
}

// ─── Status Update ────────────────────────────────────────────────────────────

export async function updateLeadStatus(
  collectionName: 'parents' | 'tutors',
  id: string,
  status: LeadStatus
) {
  return updateDoc(doc(db, collectionName, id), { status });
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const snap = await getDoc(doc(db, 'config', 'site'));
  return snap.exists() ? (snap.data() as SiteConfig) : null;
}

export async function saveSiteConfig(config: SiteConfig) {
  return setDoc(doc(db, 'config', 'site'), {
    ...config,
    updatedAt: serverTimestamp(),
  });
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export async function getAllFees(): Promise<FeeRecord[]> {
  const snap = await getDocs(query(collection(db, 'fees'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeeRecord));
}

export async function addFeeRecord(data: Omit<FeeRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'fees'), {
    ...data,
    profit: data.parentFee - data.tutorFee,
    createdAt: serverTimestamp(),
  });
}

export async function updateFeeRecord(id: string, data: Partial<FeeRecord>) {
  const updated = { ...data };
  if (data.parentFee !== undefined && data.tutorFee !== undefined) {
    updated.profit = data.parentFee - data.tutorFee;
  }
  return updateDoc(doc(db, 'fees', id), updated);
}

export async function deleteFeeRecord(id: string) {
  return deleteDoc(doc(db, 'fees', id));
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function getAllClasses(): Promise<ClassRecord[]> {
  const snap = await getDocs(query(collection(db, 'classes'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassRecord));
}

export async function addClassRecord(data: Omit<ClassRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'classes'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateClassRecord(id: string, data: Partial<ClassRecord>) {
  return updateDoc(doc(db, 'classes', id), data);
}

export async function deleteClassRecord(id: string) {
  return deleteDoc(doc(db, 'classes', id));
}
