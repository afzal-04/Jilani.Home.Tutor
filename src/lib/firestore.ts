// src/lib/firestore.ts
import {
  collection, addDoc, getDocs, doc,
  updateDoc, setDoc, getDoc, deleteDoc,
  query, orderBy, serverTimestamp,
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
