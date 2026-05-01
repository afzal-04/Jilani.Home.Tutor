'use client';

import { useState } from "react";
import { registerParent } from "@/lib/firestore";

export default function FindTutor() {
  const [form, setForm] = useState({
    name: "", phone: "", area: "", class: "", subject: "",
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
    <main style={{ minHeight:'100vh', background:'linear-gradient(135deg,#0f1923,#1a3a5c)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <div style={{ background:'#fff', borderRadius:20, padding:'40px', width:'100%', maxWidth:560, boxShadow:'0 24px 60px rgba(0,0,0,0.3)' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <span style={{ fontSize:40, display:'block', marginBottom:12 }}>🎓</span>
          <h1 style={{ fontSize:24, fontWeight:700, color:'#0f1923', marginBottom:8, lineHeight:1.3 }}>
            Find a Home Tutor in Raipur
          </h1>
          <p style={{ fontSize:14, color:'#888', lineHeight:1.6 }}>
            Fill in your details and we&apos;ll match you with the right tutor within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>

          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.4px' }}>Parent / Guardian Name *</label>
            <input
              type="text" placeholder="Your full name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required
              style={{ padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0f1923' }}
            />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.4px' }}>Phone Number *</label>
            <input
              type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} required
              style={{ padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0f1923' }}
            />
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            <label style={{ fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.4px' }}>Area / Locality in Raipur *</label>
            <input
              type="text" placeholder="e.g. Shankar Nagar, Civil Lines, Pandri" value={form.area}
              onChange={e => setForm({ ...form, area: e.target.value })} required
              style={{ padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0f1923' }}
            />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.4px' }}>Class *</label>
              <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} required
                style={{ padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0f1923', background:'#fff' }}>
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
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <label style={{ fontSize:12, fontWeight:600, color:'#555', textTransform:'uppercase', letterSpacing:'0.4px' }}>Subject *</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} required
                style={{ padding:'12px 14px', border:'1.5px solid #e2e8f0', borderRadius:10, fontSize:14, fontFamily:'inherit', color:'#0f1923', background:'#fff' }}>
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

          <button type="submit" disabled={loading}
            style={{ background:'linear-gradient(135deg,#c8942a,#f0c55a)', color:'#fff', border:'none', borderRadius:12, padding:'15px', fontSize:15, fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'inherit', marginTop:4, opacity: loading ? 0.7 : 1 }}>
            {loading ? "Submitting…" : "📅 Find My Tutor — FREE"}
          </button>

          {success && (
            <div style={{ background:'#d4edda', color:'#155724', border:'1px solid #c3e6cb', borderRadius:10, padding:'14px 16px', fontSize:14, textAlign:'center' }}>
              ✅ Thank you! We&apos;ll call you within 24 hours to confirm your free demo class.
            </div>
          )}
        </form>

        {/* Trust badges */}
        <div style={{ display:'flex', justifyContent:'center', gap:20, marginTop:24, paddingTop:20, borderTop:'1px solid #f0f0f0', flexWrap:'wrap' }}>
          <span style={{ fontSize:12, color:'#888', fontWeight:500 }}>✅ Verified Tutors</span>
          <span style={{ fontSize:12, color:'#888', fontWeight:500 }}>🆓 First Demo FREE</span>
          <span style={{ fontSize:12, color:'#888', fontWeight:500 }}>⚡ Matched in 24hrs</span>
        </div>

      </div>
    </main>
  );
}
