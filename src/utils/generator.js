import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { TEMPLATE_CONFIGS } from '../constants/templates';

/**
 * Full Luxury Website Generator for Forge Studio
 * Generates complete 5-page websites with premium design patterns
 * Ready for Netlify Drop (drag-and-drop deployment)
 */

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

// Default hero images per business type for elegant fallbacks
const HERO_IMAGES = {
  "Law Firm": '1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920',
  "Real Estate Agency": '1564013799919-ab600027f03f?auto=format&fit=crop&q=80&w=1920',
  "Dental Clinic": '1629904985106-7e2d294c1bc0?auto=format&fit=crop&q=80&w=1920',
  "Beauty Salon/Spa": '1560754496-0b3f06ceb29f?auto=format&fit=crop&q=80&w=1920',
  "Gym/Fitness Studio": '1534438097540-b8fc20e708bc?auto=format&fit=crop&q=80&w=1920',
  "Iron/Steel/Metal Factory": '1504911178280-5e5b5149cc3a?auto=format&fit=crop&q=80&w=1920',
  "Airline/Aviation": '1436497866228-0435c35616e9?auto=format&fit=crop&q=80&w=1920',
  "Construction Company": '1541888946425-d81bb192b67a?auto=format&fit=crop&q=80&w=1920',
  "Restaurant/Fine Dining": '1514933651109-f9c3c56e6db5?auto=format&fit=crop&q=80&w=1920',
  "Luxury Hotel/Resort": '1571896349842-6c8943211e1b?auto=format&fit=crop&q=80&w=1920',
  "Pharmacy/Health Clinic": '1631410717781-5c6b20e4ed61?auto=format&fit=crop&q=80&w=1920',
  "Boutique/Retail": '1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920',
  "Creative Agency": '1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920',
  "Engineering Firm": '1504911178280-5e5b5149cc3a?auto=format&fit=crop&q=80&w=1920',
  "Other": '1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1920'
};

const getHeroImg = (data) => {
  return data.heroPhoto || UNSPLASH_BASE + (HERO_IMAGES[data.businessType] || HERO_IMAGES["Other"]);
};

// ============================================================
// TEMPLATE STYLES — Design variations for the 5 templates
// ============================================================
const TEMPLATE_STYLES = {
  OBSIDIAN: { name: 'Obsidian', desc: 'Dark & dramatic with gold accents' },
  IVORY: { name: 'Ivory', desc: 'Light, minimal, and sophisticated' },
  ATLAS: { name: 'Atlas', desc: 'Bold and contemporary with high contrast' },
  NOIR: { name: 'Noir', desc: 'Monochromatic elegance with deep blacks' },
  MERIDIAN: { name: 'Meridian', desc: 'Warm neutrals with navy accents' }
};

// ============================================================
// HTML GENERATORS
// ============================================================

const buildNav = (data) => `
<nav id="navbar">
  <div class="nav-inner container">
    <a href="index.html" class="logo">${data.businessName}</a>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" ${data.sections.hero ? 'class="active"' : ''}>Home</a></li>
      ${data.sections.about ? '<li><a href="about.html">About</a></li>' : ''}
      ${data.sections.services ? '<li><a href="services.html">Services</a></li>' : ''}
      ${data.sections.gallery ? '<li><a href="gallery.html">Gallery</a></li>' : ''}
      <li><a href="contact.html">Contact</a></li>
    </ul>
  </div>
</nav>`;

const buildFooter = (data) => `
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <h3>${data.businessName}</h3>
        ${data.tagline ? `<p class="footer-tagline">${data.tagline}</p>` : ''}
        ${data.contact.address ? `<p class="footer-address">${data.contact.address}</p>` : ''}
      </div>
      <div class="footer-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="index.html">Home</a></li>
          ${data.sections.about ? '<li><a href="about.html">About</a></li>' : ''}
          ${data.sections.services ? '<li><a href="services.html">Services</a></li>' : ''}
          ${data.sections.gallery ? '<li><a href="gallery.html">Gallery</a></li>' : ''}
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-contact">
        <h4>Contact</h4>
        ${data.contact.email ? `<p><a href="mailto:${data.contact.email}">${data.contact.email}</a></p>` : ''}
        ${data.contact.phone ? `<p><a href="tel:${data.contact.phone}">${data.contact.phone}</a></p>` : ''}
        ${data.contact.whatsapp ? `<p><a href="https://wa.me/${data.contact.whatsapp}" target="_blank">WhatsApp</a></p>` : ''}
      </div>
      <div class="footer-hours">
        <h4>Hours</h4>
        <div class="hours-list">
          ${Object.entries(data.hours).map(([day, h]) => `
            <div class="hour-row">
              <span class="hour-day">${day}</span>
              <span class="hour-time">${h.open ? `${h.from} – ${h.to}` : 'Closed'}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} ${data.businessName}. All rights reserved.</p>
      ${data.poweredBy ? '<p class="powered-by">Forged with <a href="https://forgestudio.dev" target="_blank">Forge Studio</a></p>' : ''}
    </div>
  </div>
</footer>`;

const wrapPage = (data, title, content) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | ${data.businessName}</title>
  <meta name="description" content="${data.metaDescription || data.description || ''}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${data.fontPairing.heading.replace(/ /g, '+')}:wght@300;400;500;600;700&family=${data.fontPairing.body.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${buildNav(data)}
  <main>${content}</main>
  ${buildFooter(data)}
  ${data.sections.whatsappFloat && data.contact.whatsapp ? `
  <a href="https://wa.me/${data.contact.whatsapp}" target="_blank" class="whatsapp-float ${data.whatsappPosition || 'bottom-right'}" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i>
  </a>` : ''}
  <script src="script.js"></script>
</body>
</html>`;

// --- HERO SECTION ---
const heroSection = (data) => `
<section id="home" class="hero" style="background-image: url('${getHeroImg(data)}');">
  <div class="hero-overlay"></div>
  <div class="hero-content container reveal">
    <p class="hero-tagline">${data.tagline || 'Excellence Reimagined'}</p>
    <h1 class="hero-title">${data.businessName}</h1>
    <p class="hero-description">${data.description || ''}</p>
    <div class="hero-actions">
      <a href="contact.html" class="btn btn-primary">${data.ctaText || 'Get in Touch'}</a>
      ${data.sections.about ? '<a href="about.html" class="btn btn-outline">Learn More</a>' : ''}
    </div>
  </div>
</section>`;

// --- ABOUT SECTION (Home Page Summary) ---
const aboutPreviewSection = (data) => `
<section id="about" class="section about-preview">
  <div class="container">
    <div class="about-grid">
      <div class="about-image reveal-left">
        <div class="about-image-frame">
          <img src="${data.teamPhoto || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800'}" alt="About ${data.businessName}">
        </div>
        ${data.yearsInBusiness ? `<div class="years-badge"><span class="years-number">${data.yearsInBusiness}</span><span>Years of Excellence</span></div>` : ''}
      </div>
      <div class="about-text reveal-right">
        <p class="section-label">About Us</p>
        <h2>Crafted with Purpose</h2>
        <p>${data.description || `${data.businessName} is dedicated to delivering unparalleled quality and service to our valued clients.`}</p>
        <div class="about-features">
          <div class="about-feature">
            <i class="fas fa-award"></i>
            <span>Premium Quality</span>
          </div>
          <div class="about-feature">
            <i class="fas fa-handshake"></i>
            <span>Trusted Partnership</span>
          </div>
          <div class="about-feature">
            <i class="fas fa-star"></i>
            <span>Client Excellence</span>
          </div>
        </div>
        <a href="about.html" class="btn btn-text">Discover Our Story <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  </div>
</section>`;

// --- SERVICES SECTION (Home Page) ---
const servicesPreviewSection = (data) => {
  const servicesList = data.services.length > 0 ? data.services : [
    { icon: 'fa-gem', name: `${data.businessType} Service`, description: `Premium ${data.businessType.toLowerCase()} services tailored to your needs.` },
    { icon: 'fa-crown', name: 'Consultation', description: 'Expert guidance from industry professionals.' },
    { icon: 'fa-star', name: 'Support', description: 'Dedicated support every step of the way.' }
  ];
  return `
<section class="section services-preview">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">What We Do</p>
      <h2>Our Expertise</h2>
      <p class="section-desc">Comprehensive solutions designed for excellence</p>
    </div>
    <div class="services-grid">
      ${servicesList.slice(0, 6).map((s, i) => `
        <div class="service-card reveal" style="transition-delay: ${i * 0.1}s">
          <div class="service-icon"><i class="fas ${s.icon || 'fa-star'}"></i></div>
          <h3>${s.name}</h3>
          <p>${s.description}</p>
        </div>
      `).join('')}
    </div>
    <div class="section-cta reveal">
      <a href="services.html" class="btn btn-primary">View All Services</a>
    </div>
  </div>
</section>`;
};

// --- STATS SECTION ---
const statsSection = (data) => {
  const defaultStats = [
    { number: '99', suffix: '%', label: 'Client Satisfaction' },
    { number: data.yearsInBusiness || '15', suffix: '+', label: 'Years Experience' },
    { number: '500', suffix: '+', label: 'Projects Completed' },
    { number: '50', suffix: '+', label: 'Awards Won' }
  ];
  const statsList = data.stats.length > 0 ? data.stats : defaultStats;
  return `
<section class="section stats-section">
  <div class="container">
    <div class="stats-grid">
      ${statsList.map((s, i) => `
        <div class="stat-item reveal" style="transition-delay: ${i * 0.15}s">
          <h2 class="counter" data-target="${s.number}">0</h2>
          ${s.suffix ? `<span class="stat-suffix">${s.suffix}</span>` : ''}
          <p>${s.label}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
};

// --- TESTIMONIALS SECTION ---
const testimonialsSection = (data) => {
  const testimonialsList = data.testimonials.length > 0 ? data.testimonials : [
    { name: 'Jonathan Pierce', role: 'CEO, Pierce Holdings', text: `Working with ${data.businessName} was an absolute pleasure. Their attention to detail and commitment to excellence is unmatched.` },
    { name: 'Victoria Chen', role: 'Managing Partner', text: `The level of professionalism and quality we received exceeded all our expectations. Truly a world-class experience.` },
    { name: 'Marcus Sterling', role: 'Director of Operations', text: `We've worked with many firms over the years, but none compare to the dedication and expertise of ${data.businessName}.` }
  ];
  return `
<section class="section testimonials-section">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">Testimonials</p>
      <h2>What Our Clients Say</h2>
    </div>
    <div class="testimonials-grid">
      ${testimonialsList.map((t, i) => `
        <div class="testimonial-card reveal" style="transition-delay: ${i * 0.15}s">
          <div class="testimonial-stars">${'<i class="fas fa-star"></i>'.repeat(5)}</div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
            <div>
              <p class="testimonial-name">${t.name}</p>
              <p class="testimonial-role">${t.role}</p>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
};

// --- FAQ SECTION ---
const faqSection = (data) => {
  const faqsList = data.faqs.length > 0 ? data.faqs : [
    { q: 'What makes your services unique?', a: `At ${data.businessName}, we combine decades of experience with a personalized approach to deliver results that exceed expectations.` },
    { q: 'How can I get started?', a: 'Simply reach out through our contact form or give us a call. We\'ll schedule a consultation to discuss your needs.' },
    { q: 'What is your typical turnaround time?', a: 'Timelines vary by project scope, but we pride ourselves on efficient delivery without compromising on quality.' },
    { q: 'Do you offer ongoing support?', a: 'Yes, our relationship doesn\'t end after delivery. We provide continued support to ensure your complete satisfaction.' }
  ];
  return `
<section class="section faq-section">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">FAQ</p>
      <h2>Frequently Asked Questions</h2>
    </div>
    <div class="faq-list">
      ${faqsList.map((faq, i) => `
        <div class="faq-item reveal" style="transition-delay: ${i * 0.1}s">
          <button class="faq-question" aria-expanded="false">
            <span>${faq.q}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="faq-answer">
            <p>${faq.a}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;
};

// ============================================================
// FULL PAGE BUILDERS
// ============================================================

// --- HOME PAGE ---
const buildHomePage = (data) => {
  let content = '';
  if (data.sections.hero) content += heroSection(data);
  if (data.sections.stats) content += statsSection(data);
  if (data.sections.about) content += aboutPreviewSection(data);
  if (data.sections.services) content += servicesPreviewSection(data);
  if (data.sections.testimonials) content += testimonialsSection(data);
  if (data.sections.faq) content += faqSection(data);
  return wrapPage(data, 'Home', content);
};

// --- ABOUT PAGE ---
const buildAboutPage = (data) => {
  const teamMembers = data.teamMembers.length > 0 ? data.teamMembers : [
    { name: 'Alexander Blackwood', role: 'Founder & CEO', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
    { name: 'Isabella Laurent', role: 'Managing Director', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400' },
    { name: 'Marcus Sterling', role: 'Head of Operations', photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' }
  ];

  let content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">About Us</p>
    <h1>Our Story</h1>
    <p class="page-hero-desc">Discover the passion and purpose behind ${data.businessName}</p>
  </div>
</section>

<section class="section about-story">
  <div class="container">
    <div class="story-content reveal">
      <h2>Built on Excellence</h2>
      <p>${data.description || `${data.businessName} was founded with a singular vision: to redefine excellence in the ${data.businessType.toLowerCase()} industry. With years of experience and a team of dedicated professionals, we have consistently delivered results that speak for themselves.`}</p>
      <p>Our approach is rooted in the belief that every client deserves nothing less than the extraordinary. We combine innovative thinking with time-tested expertise to create solutions that stand the test of time.</p>
    </div>
    ${data.sections.stats ? `
    <div class="story-stats">
      ${(data.stats.length > 0 ? data.stats : [{ number: '99', suffix: '%', label: 'Satisfaction' }, { number: data.yearsInBusiness || '15', suffix: '+', label: 'Years' }, { number: '500', suffix: '+', label: 'Projects' }]).map((s, i) => `
        <div class="story-stat reveal" style="transition-delay: ${i * 0.1}s">
          <span class="story-stat-number counter" data-target="${s.number}">0</span>
          ${s.suffix ? `<span class="stat-suffix">${s.suffix}</span>` : ''}
          <span class="story-stat-label">${s.label}</span>
        </div>
      `).join('')}
    </div>` : ''}
  </div>
</section>

${teamMembers.length > 0 ? `
<section class="section team-section">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">Team</p>
      <h2>Meet Our Leaders</h2>
    </div>
    <div class="team-grid">
      ${teamMembers.map((m, i) => `
        <div class="team-card reveal" style="transition-delay: ${i * 0.15}s">
          <div class="team-photo"><img src="${m.photo}" alt="${m.name}" loading="lazy"></div>
          <h3>${m.name}</h3>
          <p>${m.role}</p>
        </div>
      `).join('')}
    </div>
  </div>
</section>` : ''}`;

  return wrapPage(data, 'About', content);
};

// --- SERVICES PAGE ---
const buildServicesPage = (data) => {
  const servicesList = data.services.length > 0 ? data.services : [
    { icon: 'fa-gem', name: 'Premium Consultation', description: `Expert ${data.businessType.toLowerCase()} consultation tailored to your unique requirements. Our seasoned professionals provide insights that drive results.`, features: ['Personalized Assessment', 'Strategic Planning', 'Expert Guidance', 'Follow-up Support'] },
    { icon: 'fa-crown', name: 'Executive Service', description: 'White-glove service designed for discerning clients who demand the absolute best. Every detail is meticulously curated.', features: ['VIP Treatment', 'Priority Access', 'Dedicated Concierge', 'Custom Solutions'] },
    { icon: 'fa-star', name: 'Ongoing Excellence', description: 'Long-term partnership built on trust, consistency, and unwavering commitment to your success.', features: ['Continuous Support', 'Regular Reviews', 'Performance Tracking', 'Growth Strategy'] }
  ];

  let content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">Services</p>
    <h1>What We Offer</h1>
    <p class="page-hero-desc">Comprehensive solutions crafted for the discerning client</p>
  </div>
</section>

<section class="section services-page">
  <div class="container">
    <div class="services-detailed">
      ${servicesList.map((s, i) => `
        <div class="service-detailed-card reveal" style="transition-delay: ${i * 0.1}s">
          <div class="service-detailed-icon"><i class="fas ${s.icon || 'fa-star'}"></i></div>
          <div class="service-detailed-content">
            <h3>${s.name}</h3>
            <p>${s.description}</p>
            ${s.features ? `
            <ul class="service-features">
              ${s.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
            </ul>` : ''}
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>`;

  return wrapPage(data, 'Services', content);
};

// --- GALLERY PAGE ---
const buildGalleryPage = (data) => {
  const galleryImages = data.galleryImages.length > 0 ? data.galleryImages : [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&q=80&w=800'
  ];

  let content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">Gallery</p>
    <h1>Our Portfolio</h1>
    <p class="page-hero-desc">A visual journey through our finest work</p>
  </div>
</section>

<section class="section gallery-page">
  <div class="container">
    <div class="gallery-grid">
      ${galleryImages.map((img, i) => `
        <div class="gallery-item reveal" style="transition-delay: ${i * 0.1}s">
          <img src="${img}" alt="Gallery image ${i + 1}" loading="lazy">
          <div class="gallery-overlay">
            <button class="gallery-expand" data-index="${i}" aria-label="View larger">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  </div>
</section>

<!-- Lightbox -->
<div id="lightbox" class="lightbox" aria-hidden="true">
  <button class="lightbox-close" aria-label="Close"><i class="fas fa-times"></i></button>
  <button class="lightbox-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
  <div class="lightbox-content">
    <img id="lightboxImage" src="" alt="Gallery lightbox">
  </div>
  <button class="lightbox-next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
</div>`;

  return wrapPage(data, 'Gallery', content);
};

// --- CONTACT PAGE ---
const buildContactPage = (data) => {
  let content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">Contact</p>
    <h1>Get in Touch</h1>
    <p class="page-hero-desc">We would be honored to hear from you</p>
  </div>
</section>

<section class="section contact-page">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info reveal-left">
        <h2>Let's Connect</h2>
        <p>Reach out to us and let's begin crafting something extraordinary together.</p>
        
        <div class="contact-details">
          ${data.contact.address ? `
          <div class="contact-detail">
            <i class="fas fa-map-marker-alt"></i>
            <div>
              <h4>Visit Us</h4>
              <p>${data.contact.address}</p>
            </div>
          </div>` : ''}
          ${data.contact.phone ? `
          <div class="contact-detail">
            <i class="fas fa-phone"></i>
            <div>
              <h4>Call Us</h4>
              <p><a href="tel:${data.contact.phone}">${data.contact.phone}</a></p>
            </div>
          </div>` : ''}
          ${data.contact.email ? `
          <div class="contact-detail">
            <i class="fas fa-envelope"></i>
            <div>
              <h4>Email Us</h4>
              <p><a href="mailto:${data.contact.email}">${data.contact.email}</a></p>
            </div>
          </div>` : ''}
          ${data.contact.whatsapp ? `
          <div class="contact-detail">
            <i class="fab fa-whatsapp"></i>
            <div>
              <h4>WhatsApp</h4>
              <p><a href="https://wa.me/${data.contact.whatsapp}" target="_blank">Chat with us</a></p>
            </div>
          </div>` : ''}
        </div>

        <div class="contact-hours">
          <h4>Business Hours</h4>
          <div class="hours-list">
            ${Object.entries(data.hours).map(([day, h]) => `
              <div class="hour-row">
                <span class="hour-day">${day}</span>
                <span class="hour-time">${h.open ? `${h.from} – ${h.to}` : 'Closed'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="contact-form-container reveal-right">
        <form id="contactForm" class="contact-form">
          <div class="form-group">
            <label for="name">Your Name</label>
            <input type="text" id="name" name="name" required placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="email">Your Email</label>
            <input type="email" id="email" name="email" required placeholder="john@example.com">
          </div>
          <div class="form-group">
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" placeholder="How can we help?">
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required placeholder="Tell us about your project..."></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block">Send Message <i class="fas fa-paper-plane"></i></button>
        </form>
      </div>
    </div>

    ${data.contact.mapsSrc ? `
    <div class="contact-map reveal">
      <iframe src="${data.contact.mapsSrc}" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>` : ''}
  </div>
</section>`;

  return wrapPage(data, 'Contact', content);
};

// ============================================================
// CSS GENERATOR
// ============================================================
const generateCSS = (data) => {
  const template = data.templateStyle || 'OBSIDIAN';
  const tpl = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.OBSIDIAN;
  
  // User-selected colors override template defaults
  const primaryColor = data.primaryColor || tpl.colors.primary;
  const secondaryColor = data.secondaryColor || tpl.colors.accent;
  
  // User-selected fonts override template defaults
  const hFont = data.fontPairing?.heading || tpl.typography.heading;
  const bFont = data.fontPairing?.body || tpl.typography.body;

  const { colors, typography, patterns } = tpl;

  // Compute background color from template
  const bgColor = colors.background || '#0A0A0B';
  const surfaceColor = colors.surface || '#111113';

  // Generate appropriate shadows based on pattern
  const shadow = patterns.shadow === 'none' ? 'none' : 
    patterns.shadow === 'soft' ? '0 4px 20px rgba(0,0,0,0.08)' :
    patterns.shadow === 'sm' ? '0 2px 8px rgba(0,0,0,0.06)' :
    patterns.shadow === 'hard' ? '0 8px 0 rgba(0,0,0,0.15)' :
    patterns.shadow === 'md' ? '0 8px 30px rgba(0,0,0,0.12)' :
    '0 4px 20px rgba(0,0,0,0.1)';
  
  const shadowLg = patterns.shadow === 'none' ? 'none' : 
    patterns.shadow === 'soft' ? '0 12px 40px rgba(0,0,0,0.12)' :
    patterns.shadow === 'sm' ? '0 4px 16px rgba(0,0,0,0.1)' :
    patterns.shadow === 'hard' ? '0 12px 0 rgba(0,0,0,0.2)' :
    patterns.shadow === 'md' ? '0 20px 60px rgba(0,0,0,0.15)' :
    '0 20px 60px rgba(0,0,0,0.15)';

  const borderRadius = patterns.borderRadius;
  const btnRadius = patterns.buttonStyle === 'pill' ? '9999px' : 
    patterns.buttonStyle === 'rounded' ? '12px' :
    patterns.buttonStyle === 'rectangle' ? '2px' : '0px';

  return `/* ============================================================
   ${data.businessName} — Generated by Forge Studio
   Template: ${template} — ${tpl.name}
   Description: ${tpl.description}
   ============================================================ */

:root {
  --primary: ${primaryColor};
  --primary-light: ${primaryColor}22;
  --primary-dark: ${primaryColor};
  --secondary: ${secondaryColor};
  --bg: ${colors.background};
  --surface: ${colors.surface};
  --text: ${colors.text};
  --muted: ${colors.muted};
  --border: ${colors.border};
  --accent: ${colors.accent};
  --heading-font: '${hFont}', serif;
  --body-font: '${bFont}', sans-serif;
  --heading-weight: ${typography.headingWeight};
  --letter-spacing: ${typography.letterSpacing};
  --base-size: ${typography.baseSize};
  --radius: ${borderRadius};
  --btn-radius: ${btnRadius};
  --shadow: ${shadow};
  --shadow-lg: ${shadowLg};
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   RESET & BASE
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--body-font);
  color: var(--text);
  background-color: var(--bg);
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}

img { max-width: 100%; height: auto; display: block; }
a { color: inherit; text-decoration: none; transition: var(--transition); }
ul { list-style: none; }

h1, h2, h3, h4, h5, h6 {
  font-family: var(--heading-font);
  font-weight: 600;
  line-height: 1.2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section {
  padding: 100px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.section-label {
  font-family: var(--body-font);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 12px;
}

.section-header h2 {
  font-size: 2.8rem;
  margin-bottom: 16px;
  color: var(--text);
}

.section-desc {
  color: var(--muted);
  font-size: 1.1rem;
}

.section-cta {
  text-align: center;
  margin-top: 40px;
}

/* ============================================================
   BUTTONS
   ============================================================ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  font-family: var(--body-font);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: var(--transition);
  border: none;
  text-decoration: none;
}

.btn-primary {
  background: var(--primary);
  color: ${bgColor};
}

.btn-primary:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 8px 30px var(--primary)40;
  }

.btn-outline {
  background: transparent;
  color: var(--text);
  border: 2px solid var(--text);
}

.btn-outline:hover {
  background: var(--text);
  color: var(--bg);
  transform: translateY(-2px);
}

.btn-text {
  background: transparent;
  color: var(--primary);
  padding: 8px 0;
  font-size: 0.85rem;
}

.btn-text:hover {
  gap: 12px;
  opacity: 0.8;
}

.btn-block {
  width: 100%;
  justify-content: center;
}

/* ============================================================
   NAVIGATION
   ============================================================ */
#navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 16px 0;
  transition: var(--transition);
  background: transparent;
}

#navbar.scrolled {
  background: ${bgColor}E6;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  padding: 10px 0;
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-family: var(--heading-font);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 32px;
  align-items: center;
}

.nav-links a {
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--text);
  opacity: 0.75;
  position: relative;
  padding-bottom: 4px;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary);
  transition: var(--transition);
}

.nav-links a:hover,
.nav-links a.active {
  opacity: 1;
}

.nav-links a:hover::after,
.nav-links a.active::after {
  width: 100%;
}

.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  z-index: 1001;
}

.hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--text);
  transition: var(--transition);
  border-radius: 2px;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ============================================================
   HERO
   ============================================================ */
.hero {
  height: 100vh;
  min-height: 700px;
  display: flex;
  align-items: center;
  background-size: cover;
  background-position: center;
  position: relative;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
}

.hero-tagline {
  font-size: 0.85rem;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 16px;
  font-weight: 500;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  color: #fff;
  letter-spacing: -1px;
}

.hero-description {
  font-size: 1.15rem;
  color: rgba(255,255,255,0.8);
  max-width: 600px;
  margin-bottom: 36px;
  line-height: 1.8;
}

.hero-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

/* ============================================================
   PAGE HERO (Inner Pages)
   ============================================================ */
.page-hero {
  padding: 180px 0 80px;
  background: linear-gradient(135deg, var(--secondary) 0%, var(--bg) 100%);
  position: relative;
}

.page-hero-content {
  text-align: center;
}

.page-hero h1 {
  font-size: 3.5rem;
  margin-bottom: 16px;
}

.page-hero-desc {
  color: var(--muted);
  font-size: 1.15rem;
  max-width: 500px;
  margin: 0 auto;
}

/* ============================================================
   ABOUT
   ============================================================ */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.about-image {
  position: relative;
}

.about-image-frame {
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.about-image-frame img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  transition: var(--transition);
}

.about-image-frame:hover img {
  transform: scale(1.03);
}

.years-badge {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: var(--primary);
  color: ${bgColor};
  padding: 20px 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-lg);
}

.years-number {
  font-family: var(--heading-font);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
}

.about-text h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.about-text > p {
  color: var(--muted);
  margin-bottom: 24px;
  font-size: 1.05rem;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.about-feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  text-align: center;
  font-size: 0.8rem;
  font-weight: 500;
}

.about-feature i {
  font-size: 1.5rem;
  color: var(--primary);
}

/* ============================================================
   ABOUT PAGE - STORY
   ============================================================ */
.story-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.story-content h2 {
  font-size: 2.5rem;
  margin-bottom: 24px;
}

.story-content p {
  color: var(--muted);
  margin-bottom: 16px;
  font-size: 1.05rem;
}

.story-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-top: 60px;
  text-align: center;
}

.story-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.story-stat-number {
  font-family: var(--heading-font);
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
}

.story-stat-label {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 4px;
}

/* ============================================================
   TEAM
   ============================================================ */
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
}

.team-card {
  text-align: center;
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.team-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.team-photo {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 20px;
  border: 3px solid var(--primary);
  padding: 4px;
}

.team-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.team-card h3 {
  font-size: 1.3rem;
  margin-bottom: 4px;
}

.team-card p {
  color: var(--muted);
  font-size: 0.9rem;
}

/* ============================================================
   SERVICES
   ============================================================ */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.service-card {
  padding: 40px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 0;
  background: var(--primary);
  transition: var(--transition);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.service-card:hover::before {
  height: 100%;
}

.service-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.service-card h3 {
  font-size: 1.3rem;
  margin-bottom: 12px;
}

.service-card p {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.7;
}

/* --- Services Page Detailed --- */
.services-detailed {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.service-detailed-card {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 32px;
  padding: 40px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.service-detailed-card:hover {
  transform: translateX(8px);
  box-shadow: var(--shadow);
}

.service-detailed-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 2rem;
}

.service-detailed-content h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.service-detailed-content p {
  color: var(--muted);
  margin-bottom: 16px;
}

.service-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.service-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: var(--text);
}

.service-features li i {
  color: var(--primary);
  font-size: 0.8rem;
}

/* ============================================================
   STATS
   ============================================================ */
.stats-section {
  background: ${surfaceColor};
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;
}

.stat-item {
  position: relative;
}

.stat-item h2 {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
  display: inline;
}

.stat-suffix {
  font-family: var(--heading-font);
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-left: 2px;
}

.stat-item p {
  color: var(--muted);
  font-size: 0.9rem;
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ============================================================
   TESTIMONIALS
   ============================================================ */
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
}

.testimonial-card {
  padding: 36px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: var(--transition);
}

.testimonial-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
}

.testimonial-stars {
  color: #FFD700;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.testimonial-text {
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.8;
  font-style: italic;
  margin-bottom: 20px;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.testimonial-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary);
  color: ${bgColor};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
}

.testimonial-name {
  font-weight: 600;
  font-size: 0.95rem;
}

.testimonial-role {
  color: var(--muted);
  font-size: 0.8rem;
}

/* ============================================================
   FAQ
   ============================================================ */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  background: transparent;
  border: none;
  color: var(--text);
  font-family: var(--heading-font);
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
  transition: var(--transition);
}

.faq-question i {
  font-size: 0.8rem;
  transition: var(--transition);
  color: var(--muted);
}

.faq-question:hover {
  color: var(--primary);
}

.faq-item.active .faq-question {
  color: var(--primary);
}

.faq-item.active .faq-question i {
  transform: rotate(180deg);
  color: var(--primary);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
}

.faq-item.active .faq-answer {
  max-height: 300px;
  padding-bottom: 20px;
}

.faq-answer p {
  color: var(--muted);
  line-height: 1.8;
  padding-right: 40px;
}

/* ============================================================
   GALLERY
   ============================================================ */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
  aspect-ratio: 4/3;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: var(--transition);
}

.gallery-item:hover .gallery-overlay {
  opacity: 1;
}

.gallery-expand {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: ${bgColor};
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: var(--transition);
}

.gallery-expand:hover {
  transform: scale(1.1);
}

/* --- Lightbox --- */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0,0,0,0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.lightbox.active {
  opacity: 1;
  pointer-events: all;
}

.lightbox-content {
  max-width: 80vw;
  max-height: 80vh;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  opacity: 0.7;
  transition: var(--transition);
}

.lightbox-close:hover { opacity: 1; }

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2.5rem;
  cursor: pointer;
  opacity: 0.5;
  transition: var(--transition);
  padding: 16px;
}

.lightbox-prev:hover,
.lightbox-next:hover { opacity: 1; }

.lightbox-prev { left: 20px; }
.lightbox-next { right: 20px; }

/* ============================================================
   CONTACT
   ============================================================ */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
}

.contact-info h2 {
  font-size: 2rem;
  margin-bottom: 16px;
}

.contact-info > p {
  color: var(--muted);
  margin-bottom: 36px;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 36px;
}

.contact-detail {
  display: flex;
  gap: 16px;
}

.contact-detail i {
  width: 44px;
  height: 44px;
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-light);
  color: var(--primary);
  font-size: 1.1rem;
}

.contact-detail h4 {
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.contact-detail p,
.contact-detail a {
  color: var(--muted);
  font-size: 0.9rem;
}

.contact-detail a:hover {
  color: var(--primary);
}

.contact-hours h4 {
  margin-bottom: 16px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hours-list {
  max-width: 320px;
}

.hour-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.9rem;
}

.hour-day {
  font-weight: 500;
}

.hour-time {
  color: var(--muted);
}

/* Contact Form */
.contact-form-container {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: var(--body-font);
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.contact-map {
  margin-top: 60px;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
}

/* ============================================================
   FOOTER
   ============================================================ */
footer {
  background: ${surfaceColor};
  border-top: 1px solid var(--border);
  padding: 60px 0 30px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 48px;
  margin-bottom: 40px;
}

.footer-brand h3 {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.footer-tagline {
  color: var(--primary);
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.footer-address {
  color: var(--muted);
  font-size: 0.85rem;
}

.footer-links h4,
.footer-contact h4,
.footer-hours h4 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  color: var(--text);
}

.footer-links li {
  margin-bottom: 8px;
}

.footer-links a {
  color: var(--muted);
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: var(--primary);
}

.footer-contact p {
  margin-bottom: 8px;
}

.footer-contact a {
  color: var(--muted);
  font-size: 0.9rem;
}

.footer-contact a:hover {
  color: var(--primary);
}

.footer-bottom {
  border-top: 1px solid var(--border);
  padding-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--muted);
}

.powered-by a {
  color: var(--primary);
}

.powered-by a:hover {
  text-decoration: underline;
}

/* ============================================================
   WHATSAPP FLOAT
   ============================================================ */
.whatsapp-float {
  position: fixed;
  z-index: 999;
  width: 56px;
  height: 56px;
  background: #25D366;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  transition: var(--transition);
}

.whatsapp-float.bottom-right { bottom: 24px; right: 24px; }
.whatsapp-float.bottom-left { bottom: 24px; left: 24px; }

.whatsapp-float:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(37, 211, 102, 0.6);
}

/* ============================================================
   SCROLL REVEAL ANIMATIONS
   ============================================================ */
.reveal {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

.reveal-left {
  opacity: 0;
  transform: translateX(-60px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal-left.visible {
  opacity: 1;
  transform: translateX(0);
}

.reveal-right {
  opacity: 0;
  transform: translateX(60px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal-right.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 1024px) {
  .about-grid { gap: 40px; }
  .contact-grid { gap: 40px; }
  .footer-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .hamburger { display: flex; }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    width: 70%;
    max-width: 320px;
    height: 100vh;
    background: ${bgColor};
    flex-direction: column;
    padding: 100px 40px 40px;
    gap: 24px;
    transition: right 0.4s ease;
    border-left: 1px solid var(--border);
    box-shadow: -10px 0 40px rgba(0,0,0,0.3);
  }

  .nav-links.open {
    right: 0;
  }

  .hero-title { font-size: 2.8rem; }
  .hero { min-height: 600px; }

  .section { padding: 60px 0; }
  .section-header { margin-bottom: 40px; }
  .section-header h2 { font-size: 2rem; }

  .about-grid { grid-template-columns: 1fr; }
  .about-features { grid-template-columns: repeat(3, 1fr); }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .services-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .gallery-grid { grid-template-columns: repeat(2, 1fr); }
  .contact-grid { grid-template-columns: 1fr; }
  .footer-grid { grid-template-columns: 1fr; gap: 32px; }

  .page-hero h1 { font-size: 2.5rem; }
  .story-stats { grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .service-detailed-card { grid-template-columns: 1fr; }
  .service-features { grid-template-columns: 1fr; }

  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}

@media (max-width: 480px) {
  .hero-title { font-size: 2.2rem; }
  .gallery-grid { grid-template-columns: 1fr; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
  .stat-item h2 { font-size: 2.2rem; }
  .story-stats { grid-template-columns: 1fr; }
  .years-badge { position: static; margin-top: 16px; }
}`;
};

// ============================================================
// JAVASCRIPT GENERATOR
// ============================================================
const generateJS = (data) => {
  return `/* ============================================================
   ${data.businessName} — Interactive Features
   Generated by Forge Studio
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================================
  // 1. MOBILE MENU TOGGLE
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // 2. NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // ============================================================
  // 3. SCROLL-TRIGGERED REVEAL ANIMATIONS (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    revealElements.forEach(function(el) {
      el.classList.add('visible');
    });
  }

  // ============================================================
  // 4. ANIMATED NUMBER COUNTERS (Stats Section)
  // ============================================================
  const counters = document.querySelectorAll('.counter');

  if (counters.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute('data-target')) || 0;
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * target);

            counter.textContent = current.toLocaleString();

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target.toLocaleString();
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function(counter) {
      counterObserver.observe(counter);
    });
  } else {
    // Fallback: show target values immediately
    counters.forEach(function(counter) {
      counter.textContent = counter.getAttribute('data-target') || '0';
    });
  }

  // ============================================================
  // 5. FAQ ACCORDION
  // ============================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        const isActive = item.classList.contains('active');

        // Close all other FAQ items
        faqItems.forEach(function(other) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });

        // Toggle this one
        if (!isActive) {
          item.classList.add('active');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // ============================================================
  // 6. GALLERY LIGHTBOX
  // ============================================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  let currentIndex = 0;
  let galleryImages = [];

  // Collect gallery images
  document.querySelectorAll('.gallery-item img').forEach(function(img, index) {
    galleryImages.push(img.src);

    const expandBtn = img.closest('.gallery-item').querySelector('.gallery-expand');
    if (expandBtn) {
      expandBtn.addEventListener('click', function(e) {
        e.preventDefault();
        currentIndex = index;
        openLightbox(img.src);
      });
    }
  });

  function openLightbox(src) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    if (galleryImages.length === 0) return;
    currentIndex = (currentIndex + direction + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex];
    lightboxImg.alt = 'Gallery image ' + (currentIndex + 1);
  }

  // Lightbox controls
  const closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  const prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  const nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', function() { navigateLightbox(-1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { navigateLightbox(1); });

  // Close lightbox on overlay click
  if (lightbox) {
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', function(e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  // ============================================================
  // 7. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // 8. CONTACT FORM HANDLING
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      // Simulate sending (replace with actual form handling)
      setTimeout(function() {
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = '#10B981';

        setTimeout(function() {
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

});
`;
};

// ============================================================
// NETLIFY CONFIG FILES
// ============================================================
const generateNetlifyConfig = () => `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
`;

// ============================================================
// MAIN EXPORT FUNCTION
// ============================================================
/**
 * Convert a file/Blob to a Base64 data URL
 */
const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Generate custom HTML for a data URI image (handles base64 or object URLs)
 */
const imgSrc = (url) => {
  if (!url || url === '') return '';
  return url;
};

export const generateWebsite = async (data) => {
  try {
    const zip = new JSZip();
    const slug = data.slug || data.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-website';

    // --- Generate all pages ---
    zip.file("index.html", buildHomePage(data));
    
    if (data.sections.about) {
      zip.file("about.html", buildAboutPage(data));
    }
    
    if (data.sections.services) {
      zip.file("services.html", buildServicesPage(data));
    }
    
    if (data.sections.gallery) {
      zip.file("gallery.html", buildGalleryPage(data));
    }
    
    zip.file("contact.html", buildContactPage(data));

    // --- Styles ---
    zip.file("style.css", generateCSS(data));

    // --- Scripts ---
    zip.file("script.js", generateJS(data));

    // --- Netlify config for drag-and-drop deploy ---
    zip.file("netlify.toml", generateNetlifyConfig());

    // --- README ---
    zip.file("README.md", `# ${data.businessName}

## Generated by Forge Studio

A premium digital presence for ${data.businessName}.

### Deployment

**Netlify Drop (Easiest):**
1. Go to https://app.netlify.com/drop
2. Drag this entire folder onto the browser window
3. Your site is live!

**Manual Upload:**
Upload all files to any static web host.

### Structure
- \`index.html\` — Home page
${data.sections.about ? '- `about.html` — About page\n' : ''}${data.sections.services ? '- `services.html` — Services page\n' : ''}${data.sections.gallery ? '- `gallery.html` — Gallery page\n' : ''}- \`contact.html\` — Contact page
- \`style.css\` — All styles (customizable via CSS variables)
- \`script.js\` — Interactive features

### Customization
Edit \`style.css\` to modify colors, fonts, and layout. The CSS variables at the top control the primary color scheme.

---
*Forged with ❤️ by Forge Studio*
`);

    // --- Generate ZIP blob and trigger download ---
    const blob = await zip.generateAsync({ 
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: { level: 6 }
    });
    
    saveAs(blob, `${slug}-website.zip`);
  } catch (error) {
    console.error('ZIP generation failed:', error);
    throw new Error('Failed to generate website ZIP: ' + error.message);
  }
};

// ============================================================
// PREVIEW HTML (used in the React live preview)
// ============================================================
export const getPreviewHtml = (data, page = 'index') => {
  const pc = data.primaryColor || '#C9A84C';
  const sc = data.secondaryColor || '#1C2526';
  const bgColor = '#0A0A0B';
  const hFont = data.fontPairing.heading;
  const bFont = data.fontPairing.body;

  // Build page-specific preview content
  const buildPreviewContent = () => {
    switch (page) {
      case 'about':
        return `
          <section style="padding: 120px 24px 60px; max-width: 900px; margin: 0 auto;">
            <p style="color: ${pc}; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">About Us</p>
            <h1 style="font-family: '${hFont}'; font-size: 3rem; margin-bottom: 20px; color: #fff;">Our Story</h1>
            <p style="color: #999; line-height: 1.8;">${data.description || 'Dedicated to delivering unparalleled quality and service.'}</p>
            <div style="display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; margin-top: 60px;">
              ${['99%', '15+', '500+'].map((n, i) => `
                <div style="text-align:center; padding: 32px; border: 1px solid #1E1E22;">
                  <span style="font-family: '${hFont}'; font-size: 2.5rem; color: ${pc}; font-weight: 700;">${n}</span>
                  <p style="color: #999; font-size: 0.85rem; margin-top: 8px;">${['Satisfaction', 'Years', 'Projects'][i]}</p>
                </div>
              `).join('')}
            </div>
          </section>`;
      case 'services':
        return `
          <section style="padding: 120px 24px 60px; max-width: 900px; margin: 0 auto;">
            <p style="color: ${pc}; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">Services</p>
            <h1 style="font-family: '${hFont}'; font-size: 3rem; margin-bottom: 40px; color: #fff;">What We Offer</h1>
            <div style="display: grid; gap: 24px;">
              ${(data.services.length > 0 ? data.services : [
                { name: 'Premium Service', description: 'Tailored solutions for discerning clients.' },
                { name: 'Expert Consultation', description: 'Guidance from industry professionals.' }
              ]).map(s => `
                <div style="display:flex; gap:24px; padding:32px; border:1px solid #1E1E22; background:#111113;">
                  <div style="width:56px;height:56px;background:${pc}22;display:flex;align-items:center;justify-content:center;color:${pc};font-size:1.4rem;flex-shrink:0;">✦</div>
                  <div>
                    <h3 style="font-family:'${hFont}';font-size:1.3rem;margin-bottom:8px;color:#fff;">${s.name}</h3>
                    <p style="color:#999;line-height:1.7;">${s.description}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>`;
      case 'contact':
        return `
          <section style="padding: 120px 24px 60px; max-width: 900px; margin: 0 auto;">
            <p style="color: ${pc}; font-size: 0.75rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 12px;">Contact</p>
            <h1 style="font-family: '${hFont}'; font-size: 3rem; margin-bottom: 20px; color: #fff;">Get in Touch</h1>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 40px;">
              <div>
                ${data.contact.address ? `<p style="color:#999;margin-bottom:12px;"><strong style="color:#fff;">Address:</strong> ${data.contact.address}</p>` : ''}
                ${data.contact.phone ? `<p style="color:#999;margin-bottom:12px;"><strong style="color:#fff;">Phone:</strong> ${data.contact.phone}</p>` : ''}
                ${data.contact.email ? `<p style="color:#999;margin-bottom:12px;"><strong style="color:#fff;">Email:</strong> ${data.contact.email}</p>` : ''}
              </div>
              <div style="background:#111113;border:1px solid #1E1E22;padding:32px;">
                <div style="margin-bottom:16px;">
                  <label style="color:#6B6B7A;font-size:0.75rem;text-transform:uppercase;letter-spacing:1px;">Message</label>
                  <div style="height:120px;background:#0A0A0B;border:1px solid #1E1E22;margin-top:8px;"></div>
                </div>
                <div style="background:${pc};color:${bgColor};padding:14px;text-align:center;font-weight:600;text-transform:uppercase;letter-spacing:1px;font-size:0.85rem;">Send Message</div>
              </div>
            </div>
          </section>`;
      default: // home
        return `
          <div style="height:100vh;display:flex;align-items:center;background:linear-gradient(135deg,rgba(0,0,0,0.7),rgba(0,0,0,0.3)),url('${getHeroImg(data)}');background-size:cover;background-position:center;padding:0 24px;">
            <div style="max-width: 700px;">
              <p style="color: ${pc}; font-size: 0.85rem; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 16px;">${data.tagline || 'Excellence Reimagined'}</p>
              <h1 style="font-family: '${hFont}'; font-size: 4rem; color: #fff; margin-bottom: 20px;">${data.businessName}</h1>
              <p style="color: rgba(255,255,255,0.8); font-size: 1.15rem; margin-bottom: 36px; max-width: 600px;">${data.description || ''}</p>
              <div style="display:flex;gap:16px;">
                <a href="#" style="background:${pc};color:${bgColor};padding:14px 32px;text-transform:uppercase;font-weight:600;font-size:0.85rem;letter-spacing:1px;text-decoration:none;display:inline-block;">${data.ctaText || 'Get in Touch'}</a>
                ${data.sections.about ? `<a href="#" style="background:transparent;color:#fff;padding:14px 32px;border:2px solid #fff;text-transform:uppercase;font-weight:600;font-size:0.85rem;letter-spacing:1px;text-decoration:none;display:inline-block;">Learn More</a>` : ''}
              </div>
            </div>
          </div>`;
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=${hFont.replace(/ /g, '+')}:wght@300;400;500;600;700&family=${bFont.replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: '${bFont}', sans-serif; background: ${bgColor}; color: #f5f5f0; -webkit-font-smoothing: antialiased; }
    h1, h2, h3 { font-family: '${hFont}', serif; }
    a { text-decoration: none; }
  </style>
</head>
<body>
  ${buildPreviewContent()}
</body>
</html>`;
};