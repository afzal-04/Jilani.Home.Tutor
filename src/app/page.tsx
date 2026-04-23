// src/app/page.tsx
import Navbar        from '@/components/Navbar';
import WhatsappButton from '@/components/WhatsappButton';
import Hero          from '@/sections/Hero';
import Trust         from '@/sections/Trust';
import Problems      from '@/sections/Problems';
import WhyUs         from '@/sections/WhyUs';
import Services      from '@/sections/Services';
import Register      from '@/sections/Register';
import Testimonials  from '@/sections/Testimonials';
import Faq           from '@/sections/Faq';
import CtaBand       from '@/sections/CtaBand';
import Footer        from '@/sections/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Trust />
        <Problems />
        <WhyUs />
        <Services />
        <Register />
        <Testimonials />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <WhatsappButton />
    </>
  );
}
