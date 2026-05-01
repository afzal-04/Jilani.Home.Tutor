'use client';

import { useState } from "react";
import { registerParent } from "@/lib/firestore";
import styles from "./find-tutor.module.css";

export default function FindTutor() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
    class: "",
    subject: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await registerParent(form);
      setSuccess(true);
      setForm({ name: "", phone: "", area: "", class: "", subject: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <span className={styles.icon}>🎓</span>
          <h1>Find a Home Tutor in Raipur</h1>
          <p>Fill in your details and we&apos;ll match you with the right tutor within 24 hours.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.group}>
            <label>Parent / Guardian Name *</label>
            <input
              type="text"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Phone Number *</label>
            <input
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          <div className={styles.group}>
            <label>Area / Locality in Raipur *</label>
            <input
              type="text"
              placeholder="e.g. Shankar Nagar, Civil Lines, Pandri"
              value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.group}>
              <label>Class Needed *</label>
              <select
                value={form.class}
                onChange={e => setForm({ ...form, class: e.target.value })}
                required
              >
                <option value="">Select Class</option>
                <option>Class 1–5</option>
                <option>Class 6–8</option>
                <option>Class 9–10</option>
                <option>Class 11–12</option>
                <option>Competitive Exam</option>
                <option>Summer Class</option>
                <option>Drawing</option>
                <option>Music</option>
                <option>Dance</option>
              </select>
            </div>

            <div className={styles.group}>
              <label>Subject Needed *</label>
              <select
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                required
              >
                <option value="">Select Subject</option>
                <option>Maths</option>
                <option>Science</option>
                <option>English</option>
                <option>Hindi</option>
                <option>Social Science</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Biology</option>
                <option>Maths + Science</option>
                <option>All Subjects</option>
                <option>Drawing / Art</option>
                <option>Music / Singing</option>
                <option>Dance</option>
              </select>
            </div>
          </div>

          <button type="submit" className={styles.btn} disabled={loading}>
            {loading ? "Submitting…" : "📅 Find My Tutor — FREE"}
          </button>

          {success && (
            <div className={styles.success}>
              ✅ Thank you! We&apos;ll call you within 24 hours to confirm your free demo class.
            </div>
          )}
        </form>

        <div className={styles.trust}>
          <span>✅ Verified Tutors</span>
          <span>🆓 First Demo FREE</span>
          <span>⚡ Matched in 24hrs</span>
        </div>
      </div>
    </main>
  );
}
