// src/lib/firestore.ts
import {
  collection, addDoc, getDocs, doc,
  updateDoc, setDoc, getDoc, deleteDoc,
  query, orderBy, serverTimestamp,
  Firestore,
} from 'firebase/firestore';
import { db as _db } from './firebase';

// Helper — throws a clear error if called on server accidentally
function getDb(): Firestore {
  if (!_db) throw new Error('Firestore is not available on the server.');
  return _db;
}

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
  return addDoc(collection(getDb(), 'parents'), {
    ...data, status: 'new' as LeadStatus, createdAt: serverTimestamp(),
  });
}

export async function getAllParents(): Promise<ParentLead[]> {
  const snap = await getDocs(query(collection(getDb(), 'parents'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ParentLead));
}

// ─── Tutors ───────────────────────────────────────────────────────────────────

export async function registerTutor(data: Omit<TutorLead, 'id' | 'status' | 'createdAt'>) {
  return addDoc(collection(getDb(), 'tutors'), {
    ...data, status: 'new' as LeadStatus, createdAt: serverTimestamp(),
  });
}

export async function getAllTutors(): Promise<TutorLead[]> {
  const snap = await getDocs(query(collection(getDb(), 'tutors'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as TutorLead));
}

// ─── Status Update ────────────────────────────────────────────────────────────

export async function updateLeadStatus(col: 'parents' | 'tutors', id: string, status: LeadStatus) {
  return updateDoc(doc(getDb(), col, id), { status });
}

// ─── Site Config ──────────────────────────────────────────────────────────────

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const snap = await getDoc(doc(getDb(), 'config', 'site'));
  return snap.exists() ? (snap.data() as SiteConfig) : null;
}

export async function saveSiteConfig(config: SiteConfig) {
  return setDoc(doc(getDb(), 'config', 'site'), { ...config, updatedAt: serverTimestamp() });
}

// ─── Fees ─────────────────────────────────────────────────────────────────────

export async function getAllFees(): Promise<FeeRecord[]> {
  const snap = await getDocs(query(collection(getDb(), 'fees'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeeRecord));
}

export async function addFeeRecord(data: Omit<FeeRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(getDb(), 'fees'), {
    ...data, profit: data.parentFee - data.tutorFee, createdAt: serverTimestamp(),
  });
}

export async function updateFeeRecord(id: string, data: Partial<FeeRecord>) {
  const updated = { ...data };
  if (data.parentFee !== undefined && data.tutorFee !== undefined) {
    updated.profit = data.parentFee - data.tutorFee;
  }
  return updateDoc(doc(getDb(), 'fees', id), updated);
}

export async function deleteFeeRecord(id: string) {
  return deleteDoc(doc(getDb(), 'fees', id));
}

// ─── Classes ──────────────────────────────────────────────────────────────────

export async function getAllClasses(): Promise<ClassRecord[]> {
  const snap = await getDocs(query(collection(getDb(), 'classes'), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as ClassRecord));
}

export async function addClassRecord(data: Omit<ClassRecord, 'id' | 'createdAt'>) {
  return addDoc(collection(getDb(), 'classes'), { ...data, createdAt: serverTimestamp() });
}

export async function updateClassRecord(id: string, data: Partial<ClassRecord>) {
  return updateDoc(doc(getDb(), 'classes', id), data);
}

export async function deleteClassRecord(id: string) {
  return deleteDoc(doc(getDb(), 'classes', id));
}
