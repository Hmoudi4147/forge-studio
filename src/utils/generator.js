import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { TEMPLATE_CONFIGS, SERVICE_EMOJIS } from '../constants';

const UNSPLASH_BASE = 'https://images.unsplash.com/photo-';

// Helper to get auto-matched emoji or generic fallback
const getAutoEmoji = (service, businessType) => {
  const dictionary = SERVICE_EMOJIS[businessType] || SERVICE_EMOJIS["Other"];
  const text = (service.name + ' ' + (service.description || '')).toLowerCase();
  for (const [keyword, emoji] of Object.entries(dictionary)) {
    if (keyword !== 'fallback' && text.includes(keyword)) {
      return emoji;
    }
  }
  return dictionary.fallback || "⭐";
};

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

const buildNav = (data) => `
<nav id="navbar">
  <div class="nav-inner container">
    <a href="index.html" class="logo">${data.businessName}</a>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" class="active">Home</a></li>
      ${data.sections.about ? '<li><a href="about.html">About</a></li>' : ''}
      ${data.sections.services ? `<li><a href="services.html">${data.servicesLabel || 'Services'}</a></li>` : ''}
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
          ${data.sections.services ? `<li><a href="services.html">${data.servicesLabel || 'Services'}</a></li>` : ''}
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
  <link href="https://fonts.googleapis.com/css2?family=${(data.fontPairing?.heading || 'Cormorant Garamond').replace(/ /g, '+')}:wght@300;400;500;600;700&family=${(data.fontPairing?.body || 'DM Sans').replace(/ /g, '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  ${buildNav(data)}
  <main>${content}</main>
  ${buildFooter(data)}
  ${data.sections.whatsappFloat && data.contact.whatsapp ? `
  <a href="https://wa.me/${data.contact.whatsapp}?text=Hello%2C%20I%27m%20interested%20in%20your%20services" target="_blank" class="whatsapp-float ${data.whatsappPosition || 'bottom-right'}" aria-label="Chat on WhatsApp">
    <i class="fab fa-whatsapp"></i>
    <span class="whatsapp-tooltip">Chat with us</span>
  </a>` : ''}
  <script src="script.js"></script>
</body>
</html>`;

const buildHeroSection = (data) => {
  const heroImg = getHeroImg(data);
  const typeData = { hero: data.heroText || `Welcome to ${data.businessName}`, cta: data.ctaText || 'Contact Us' };
  return `
<section class="hero" style="background-image: url('${heroImg}')">
  <div class="hero-overlay"></div>
  <div class="hero-content container">
    <p class="hero-eyebrow reveal">${data.tagline || ''}</p>
    <h1 class="hero-title reveal">${data.businessName}</h1>
    <p class="hero-subtitle reveal">${typeData.hero}</p>
    <div class="hero-ctas reveal">
      <a href="contact.html" class="btn btn-primary">${typeData.cta}</a>
      <a href="#about" class="btn btn-ghost">Learn More</a>
    </div>
  </div>
  <div class="hero-scroll-indicator">
    <span></span>
  </div>
</section>`;
};

const buildServicesPreview = (data) => {
  const servicesList = data.services && data.services.length > 0 ? data.services : [
    { name: `${data.businessType} Service`, description: `Premium ${(data.businessType || '').toLowerCase()} services tailored to your needs.` },
    { name: 'Consultation', description: 'Expert guidance from industry professionals.' },
    { name: 'Support', description: 'Dedicated support every step of the way.' }
  ];
  return `
<section class="section services-preview" id="services">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">What We Do</p>
      <h2>${data.servicesLabel || 'Our Services'}</h2>
      <p class="section-desc">Comprehensive solutions designed for excellence</p>
    </div>
    <div class="services-grid">
      ${servicesList.slice(0, 6).map((s, i) => {
        const emoji = getAutoEmoji(s, data.businessType);
        return `
        <div class="service-card reveal-up" style="animation-delay: ${i * 0.1}s">
          <div class="service-icon-container">
            ${s.photo ? `<img src="${s.photo}" alt="${s.name}" class="service-photo">` : `<span class="service-emoji">${emoji}</span>`}
          </div>
          <h3>${s.name}</h3>
          <p>${s.description || ''}</p>
        </div>`;
      }).join('')}
    </div>
    <div class="section-cta reveal">
      <a href="services.html" class="btn btn-primary">View All ${data.servicesLabel || 'Services'}</a>
    </div>
  </div>
</section>`;
};

const buildAboutSection = (data) => `
<section class="section about-preview" id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-image reveal-left">
        ${data.teamPhoto ? `<img src="${data.teamPhoto}" alt="About ${data.businessName}">` : `<div class="about-image-placeholder"></div>`}
        ${data.yearsInBusiness ? `<div class="years-badge"><span>${data.yearsInBusiness}</span><small>Years of Excellence</small></div>` : ''}
      </div>
      <div class="about-content reveal-right">
        <p class="section-label">About Us</p>
        <h2>Our Story</h2>
        <p>${data.description || `${data.businessName} is dedicated to delivering exceptional ${(data.businessType || '').toLowerCase()} services.`}</p>
        <a href="about.html" class="btn btn-outline">Learn More</a>
      </div>
    </div>
  </div>
</section>`;

const buildHomePage = (data) => {
  let sections = buildHeroSection(data);
  if (data.sections.about) sections += buildAboutSection(data);
  if (data.sections.services) sections += buildServicesPreview(data);
  return wrapPage(data, 'Home', sections);
};

const buildAboutPage = (data) => {
  const content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">About Us</p>
    <h1>${data.businessName}</h1>
    <p class="page-hero-desc">${data.tagline || ''}</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="about-grid">
      <div class="about-image reveal-left">
        ${data.teamPhoto ? `<img src="${data.teamPhoto}" alt="About ${data.businessName}">` : `<div class="about-image-placeholder"></div>`}
        ${data.yearsInBusiness ? `<div class="years-badge"><span>${data.yearsInBusiness}</span><small>Years of Excellence</small></div>` : ''}
      </div>
      <div class="about-content reveal-right">
        <h2>Our Story</h2>
        <p>${data.description || ''}</p>
        <a href="contact.html" class="btn btn-primary">${data.ctaText || 'Contact Us'}</a>
      </div>
    </div>
  </div>
</section>
${data.sections.stats && data.stats && data.stats.length > 0 ? `
<section class="section stats-section">
  <div class="container">
    <div class="stats-grid">
      ${data.stats.map(s => `
      <div class="stat-item reveal">
        <span class="stat-number" data-target="${s.number}">${s.number}</span>
        <span class="stat-label">${s.label}</span>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}
${data.sections.team && data.teamMembers && data.teamMembers.length > 0 ? `
<section class="section team-section">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">Our Team</p>
      <h2>Meet the Experts</h2>
    </div>
    <div class="team-grid">
      ${data.teamMembers.map((m, i) => `
      <div class="team-card reveal-up" style="animation-delay: ${i * 0.1}s">
        ${m.photo ? `<img src="${m.photo}" alt="${m.name}" class="team-photo">` : '<div class="team-photo-placeholder"></div>'}
        <h3>${m.name}</h3>
        <p class="team-role">${m.role || ''}</p>
        <p class="team-bio">${m.bio || ''}</p>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}`;
  return wrapPage(data, 'About', content);
};

const buildServicesPage = (data) => {
  const servicesList = data.services && data.services.length > 0 ? data.services : [
    { name: `${data.businessType} Service`, description: `Premium ${(data.businessType || '').toLowerCase()} services.` },
    { name: 'Consultation', description: 'Expert guidance from professionals.' },
    { name: 'Support', description: 'Dedicated support every step of the way.' }
  ];
  const content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">${data.servicesLabel || 'Services'}</p>
    <h1>What We Offer</h1>
    <p class="page-hero-desc">Comprehensive solutions crafted for the discerning client</p>
  </div>
</section>
<section class="section">
  <div class="container">
    <div class="services-grid services-grid-full">
      ${servicesList.map((s, i) => {
        const emoji = getAutoEmoji(s, data.businessType);
        return `
        <div class="service-card reveal-up" style="animation-delay: ${i * 0.1}s">
          <div class="service-icon-container">
            ${s.photo ? `<img src="${s.photo}" alt="${s.name}" class="service-photo">` : `<span class="service-emoji">${emoji}</span>`}
          </div>
          <h3>${s.name}</h3>
          <p>${s.description || ''}</p>
        </div>`;
      }).join('')}
    </div>
  </div>
</section>
${data.sections.testimonials && data.testimonials && data.testimonials.length > 0 ? `
<section class="section testimonials-section">
  <div class="container">
    <div class="section-header reveal">
      <p class="section-label">Testimonials</p>
      <h2>What Our Clients Say</h2>
    </div>
    <div class="testimonials-grid">
      ${data.testimonials.map((t, i) => `
      <div class="testimonial-card reveal-up" style="animation-delay: ${i * 0.1}s">
        <div class="stars">${'★'.repeat(t.rating || 5)}</div>
        <p class="testimonial-text">"${t.text}"</p>
        <div class="testimonial-author">
          <strong>${t.name}</strong>
          ${t.role ? `<span>${t.role}</span>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>` : ''}`;
  return wrapPage(data, data.servicesLabel || 'Services', content);
};

const buildGalleryPage = (data) => {
  const userPhotos = data.productGallery || [];
  const legacyPhotos = data.galleryImages || [];
  const galleryImages = userPhotos.length > 0 ? userPhotos : legacyPhotos;

  const content = `
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
      ${galleryImages.length > 0 ? galleryImages.map((img, i) => {
        const src = typeof img === 'string' ? img : img.src;
        const caption = typeof img === 'object' && img.caption ? img.caption : '';
        return `
        <div class="gallery-item reveal" style="animation-delay: ${i * 0.1}s">
          <img src="${src}" alt="${caption || `Gallery image ${i + 1}`}" loading="lazy">
          ${caption ? `<div class="gallery-caption">${caption}</div>` : ''}
          <div class="gallery-overlay">
            <button class="gallery-expand" data-index="${i}" aria-label="View larger">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>`;
      }).join('') : '<p class="no-gallery">No gallery images added yet.</p>'}
    </div>
  </div>
</section>
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

const buildContactPage = (data) => {
  const whatsappMsg = encodeURIComponent(`Hello, I'm interested in your services at ${data.businessName}`);
  const content = `
<section class="page-hero">
  <div class="container page-hero-content reveal">
    <p class="section-label">Contact</p>
    <h1>Get In Touch</h1>
    <p class="page-hero-desc">We'd love to hear from you</p>
  </div>
</section>
<section class="section contact-section">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-form-wrap reveal-left">
        <h2>Send a Message</h2>
        <form class="contact-form" id="contactForm">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" name="name" required placeholder="Your name">
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" placeholder="+1 234 567 8900">
          </div>
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" required placeholder="How can we help you?" rows="5"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-full">Send Message</button>
          <div id="formSuccess" class="form-success" style="display:none">
            ✓ Message sent! We'll be in touch soon.
          </div>
        </form>
      </div>
      <div class="contact-info-wrap reveal-right">
        <h2>Contact Information</h2>
        <div class="contact-details">
          ${data.contact.phone ? `<div class="contact-item"><i class="fas fa-phone"></i><a href="tel:${data.contact.phone}">${data.contact.phone}</a></div>` : ''}
          ${data.contact.email ? `<div class="contact-item"><i class="fas fa-envelope"></i><a href="mailto:${data.contact.email}">${data.contact.email}</a></div>` : ''}
          ${data.contact.address ? `<div class="contact-item"><i class="fas fa-map-marker-alt"></i><a href="https://maps.google.com/?q=${encodeURIComponent(data.contact.address)}" target="_blank">${data.contact.address}</a></div>` : ''}
          ${data.contact.whatsapp ? `<div class="contact-item"><i class="fab fa-whatsapp"></i><a href="https://wa.me/${data.contact.whatsapp}?text=${whatsappMsg}" target="_blank">Chat on WhatsApp</a></div>` : ''}
        </div>
        ${data.socials && data.socials.length > 0 ? `
        <div class="social-links">
          ${data.socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.platform}"><i class="fab fa-${s.platform.toLowerCase()}"></i></a>`).join('')}
        </div>` : ''}
        ${data.contact.mapsSrc ? `
        <div class="map-embed">
          <iframe src="${data.contact.mapsSrc}" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>` : ''}
        <div class="business-hours">
          <h3>Business Hours</h3>
          ${Object.entries(data.hours).map(([day, h]) => `
          <div class="hour-row">
            <span class="hour-day">${day}</span>
            <span class="hour-time">${h.open ? `${h.from} – ${h.to}` : 'Closed'}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;
  return wrapPage(data, 'Contact', content);
};

const generateCSS = (data) => {
  const template = data.templateStyle || 'OBSIDIAN';
  const tpl = TEMPLATE_CONFIGS[template] || TEMPLATE_CONFIGS.OBSIDIAN;
  const primaryColor = data.primaryColor || tpl.colors.primary;
  const secondaryColor = data.secondaryColor || tpl.colors.accent;
  const hFont = data.fontPairing?.heading || tpl.typography?.heading || 'Cormorant Garamond';
  const bFont = data.fontPairing?.body || tpl.typography?.body || 'DM Sans';

  return `/* ═══ FORGE STUDIO — Generated Website ═══ */
:root {
  --primary: ${primaryColor};
  --primary-light: ${primaryColor}22;
  --secondary: ${secondaryColor};
  --bg: ${tpl.colors?.background || '#0A0A0B'};
  --surface: ${tpl.colors?.surface || '#111113'};
  --text: ${tpl.colors?.text || '#F5F5F0'};
  --muted: ${tpl.colors?.muted || '#6B6B7A'};
  --border: ${tpl.colors?.border || '#1E1E22'};
  --heading-font: '${hFont}', serif;
  --body-font: '${bFont}', sans-serif;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --radius: 4px;
  --container: 1280px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--body-font); line-height: 1.6; -webkit-font-smoothing: antialiased; }
h1,h2,h3,h4,h5,h6 { font-family: var(--heading-font); font-weight: 500; line-height: 1.15; }
a { color: inherit; text-decoration: none; }
img { max-width: 100%; height: auto; display: block; }

.container { max-width: var(--container); margin: 0 auto; padding: 0 24px; }
.section { padding: 120px 0; }
@media (max-width: 768px) { .section { padding: 60px 0; } }

/* ─── NAVBAR ─── */
#navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 0; transition: var(--transition); }
#navbar.scrolled { background: var(--bg); border-bottom: 1px solid var(--border); padding: 12px 0; }
.nav-inner { display: flex; align-items: center; justify-content: space-between; }
.logo { font-family: var(--heading-font); font-size: 1.4rem; font-weight: 600; color: var(--text); letter-spacing: 0.05em; }
.nav-links { display: flex; list-style: none; gap: 32px; }
.nav-links a { font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); transition: color 0.2s; }
.nav-links a:hover, .nav-links a.active { color: var(--primary); }
.hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 4px; }
.hamburger span { display: block; width: 24px; height: 2px; background: var(--text); transition: var(--transition); }
@media (max-width: 768px) {
  .hamburger { display: flex; }
  .nav-links { display: none; position: fixed; inset: 0; background: var(--bg); flex-direction: column; align-items: center; justify-content: center; gap: 40px; font-size: 1.5rem; }
  .nav-links.open { display: flex; }
}

/* ─── HERO ─── */
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; background-size: cover; background-position: center; background-repeat: no-repeat; }
.hero-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.4) 100%); }
.hero-content { position: relative; z-index: 1; max-width: 800px; padding: 100px 0 60px; }
.hero-eyebrow { font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--primary); margin-bottom: 16px; }
.hero-title { font-size: clamp(2.5rem, 7vw, 6rem); font-weight: 400; color: #fff; margin-bottom: 20px; }
.hero-subtitle { font-size: clamp(1rem, 2vw, 1.25rem); color: rgba(255,255,255,0.75); margin-bottom: 40px; max-width: 560px; }
.hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
.hero-scroll-indicator { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; }
.hero-scroll-indicator span { display: block; width: 1px; height: 60px; background: linear-gradient(to bottom, var(--primary), transparent); animation: scroll-line 2s ease-in-out infinite; }
@keyframes scroll-line { 0%,100% { opacity: 0; transform: scaleY(0) translateY(-20px); } 50% { opacity: 1; transform: scaleY(1) translateY(0); } }

/* ─── BUTTONS ─── */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 14px 32px; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; border-radius: var(--radius); cursor: pointer; transition: var(--transition); border: 2px solid transparent; }
.btn-primary { background: var(--primary); color: var(--bg); border-color: var(--primary); }
.btn-primary:hover { background: transparent; color: var(--primary); }
.btn-ghost { background: transparent; color: #fff; border-color: rgba(255,255,255,0.4); }
.btn-ghost:hover { background: rgba(255,255,255,0.1); border-color: #fff; }
.btn-outline { background: transparent; color: var(--text); border-color: var(--border); }
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }
.btn-full { width: 100%; }

/* ─── SECTION HEADERS ─── */
.section-header { text-align: center; margin-bottom: 64px; }
.section-label { font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--primary); margin-bottom: 12px; }
.section-header h2 { font-size: clamp(2rem, 4vw, 3rem); margin-bottom: 16px; }
.section-desc { color: var(--muted); max-width: 480px; margin: 0 auto; }
.section-cta { text-align: center; margin-top: 48px; }

/* ─── SERVICES ─── */
.services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .services-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .services-grid { grid-template-columns: 1fr; } }
.service-card { background: var(--surface); border: 1px solid var(--border); padding: 32px; border-radius: var(--radius); transition: var(--transition); }
.service-card:hover { border-color: var(--primary); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

/* ─── SERVICE ICON ─── */
.service-icon-container { width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); background: var(--bg); margin-bottom: 24px; overflow: hidden; transition: var(--transition); border-radius: 4px; }
.service-card:hover .service-icon-container { border-color: var(--primary); box-shadow: 0 0 20px rgba(201,168,76,0.2); }
.service-emoji { font-size: 32px; line-height: 1; display: block; transition: transform 0.3s ease; }
.service-card:hover .service-emoji { transform: translateY(-2px) scale(1.1); }
.service-photo { width: 100%; height: 100%; object-fit: cover; }
.service-card h3 { font-size: 1.1rem; margin-bottom: 12px; color: var(--text); }
.service-card p { color: var(--muted); font-size: 14px; line-height: 1.6; }

/* ─── ABOUT ─── */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 40px; } }
.about-image { position: relative; }
.about-image img { width: 100%; height: 500px; object-fit: cover; border-radius: var(--radius); }
.about-image-placeholder { width: 100%; height: 500px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); }
.years-badge { position: absolute; bottom: -20px; right: -20px; background: var(--primary); color: var(--bg); padding: 20px; text-align: center; border-radius: var(--radius); }
.years-badge span { display: block; font-size: 2rem; font-weight: 700; line-height: 1; }
.years-badge small { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; }
.about-content { display: flex; flex-direction: column; gap: 24px; }
.about-content .section-label { text-align: left; }
.about-content h2 { font-size: clamp(1.8rem, 3vw, 2.5rem); }
.about-content p { color: var(--muted); line-height: 1.8; }

/* ─── GALLERY ─── */
.gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 900px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .gallery-grid { grid-template-columns: 1fr; } }
.gallery-item { position: relative; overflow: hidden; border-radius: var(--radius); aspect-ratio: 4/3; background: var(--surface); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
.gallery-item:hover img { transform: scale(1.05); }
.gallery-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.gallery-item:hover .gallery-overlay { background: rgba(0,0,0,0.4); }
.gallery-expand { background: var(--primary); border: none; color: var(--bg); width: 44px; height: 44px; border-radius: 50%; cursor: pointer; opacity: 0; transform: scale(0.8); transition: var(--transition); display: flex; align-items: center; justify-content: center; }
.gallery-item:hover .gallery-expand { opacity: 1; transform: scale(1); }
.gallery-caption { position: absolute; bottom: 0; left: 0; right: 0; padding: 12px 16px; background: linear-gradient(to top, rgba(0,0,0,0.85), transparent); color: var(--primary); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; transform: translateY(100%); transition: transform 0.3s ease; }
.gallery-item:hover .gallery-caption { transform: translateY(0); }
.no-gallery { color: var(--muted); text-align: center; padding: 60px; grid-column: 1/-1; }

/* ─── LIGHTBOX ─── */
.lightbox { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 1000; display: none; align-items: center; justify-content: center; }
.lightbox.active { display: flex; }
.lightbox-content { max-width: 90vw; max-height: 85vh; }
.lightbox-content img { max-width: 100%; max-height: 85vh; object-fit: contain; border-radius: var(--radius); }
.lightbox-close, .lightbox-prev, .lightbox-next { position: fixed; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: var(--transition); }
.lightbox-close { top: 20px; right: 20px; }
.lightbox-prev { left: 20px; top: 50%; transform: translateY(-50%); }
.lightbox-next { right: 20px; top: 50%; transform: translateY(-50%); }
.lightbox-close:hover, .lightbox-prev:hover, .lightbox-next:hover { background: var(--primary); border-color: var(--primary); color: var(--bg); }

/* ─── STATS ─── */
.stats-section { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 40px; text-align: center; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-number { display: block; font-family: var(--heading-font); font-size: clamp(2.5rem, 5vw, 4rem); color: var(--primary); line-height: 1; margin-bottom: 8px; }
.stat-label { font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); }

/* ─── TESTIMONIALS ─── */
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
@media (max-width: 900px) { .testimonials-grid { grid-template-columns: 1fr; } }
.testimonial-card { background: var(--surface); border: 1px solid var(--border); padding: 32px; border-radius: var(--radius); }
.stars { color: var(--primary); font-size: 1.2rem; margin-bottom: 16px; letter-spacing: 2px; }
.testimonial-text { color: var(--muted); font-style: italic; line-height: 1.8; margin-bottom: 24px; }
.testimonial-author strong { display: block; color: var(--text); }
.testimonial-author span { font-size: 13px; color: var(--muted); }

/* ─── TEAM ─── */
.team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
@media (max-width: 900px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px) { .team-grid { grid-template-columns: 1fr; } }
.team-card { text-align: center; }
.team-photo { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin: 0 auto 16px; border: 2px solid var(--primary); }
.team-photo-placeholder { width: 120px; height: 120px; border-radius: 50%; background: var(--surface); border: 2px solid var(--border); margin: 0 auto 16px; }
.team-role { color: var(--primary); font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase; margin: 4px 0 12px; }
.team-bio { color: var(--muted); font-size: 14px; }

/* ─── CONTACT ─── */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }
@media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr; gap: 48px; } }
.contact-form h2, .contact-info-wrap h2 { font-size: 2rem; margin-bottom: 32px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.form-group input, .form-group textarea { width: 100%; background: var(--surface); border: 1px solid var(--border); color: var(--text); font-family: var(--body-font); font-size: 14px; padding: 12px 16px; border-radius: var(--radius); outline: none; transition: border-color 0.2s; }
.form-group input:focus, .form-group textarea:focus { border-color: var(--primary); }
.form-group textarea { resize: vertical; min-height: 120px; }
.form-success { padding: 16px; background: rgba(39,174,96,0.1); border: 1px solid #27ae60; border-radius: var(--radius); color: #27ae60; margin-top: 16px; text-align: center; }
.contact-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); color: var(--muted); }
.contact-item i { color: var(--primary); width: 20px; flex-shrink: 0; }
.contact-item a { color: var(--muted); transition: color 0.2s; }
.contact-item a:hover { color: var(--primary); }
.social-links { display: flex; gap: 12px; margin-top: 24px; }
.social-links a { width: 40px; height: 40px; background: var(--surface); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: var(--transition); }
.social-links a:hover { background: var(--primary); border-color: var(--primary); color: var(--bg); }
.map-embed { margin-top: 24px; border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); }
.business-hours { margin-top: 32px; }
.business-hours h3 { font-size: 1.1rem; margin-bottom: 16px; }
.hour-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 13px; }
.hour-day { color: var(--muted); }

/* ─── PAGE HERO ─── */
.page-hero { padding: 160px 0 80px; background: var(--surface); border-bottom: 1px solid var(--border); }
.page-hero-content { max-width: 600px; }
.page-hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 16px; }
.page-hero-desc { color: var(--muted); font-size: 1.1rem; }

/* ─── FOOTER ─── */
footer { background: var(--surface); border-top: 1px solid var(--border); padding: 80px 0 40px; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
@media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr; } }
footer h3 { font-size: 1.4rem; margin-bottom: 12px; }
footer h4 { font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--muted); margin-bottom: 20px; }
footer ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
footer ul a { color: var(--muted); font-size: 14px; transition: color 0.2s; }
footer ul a:hover { color: var(--primary); }
.footer-tagline { color: var(--muted); font-size: 14px; margin-top: 8px; }
.footer-address { color: var(--muted); font-size: 13px; margin-top: 8px; line-height: 1.5; }
.footer-contact p { color: var(--muted); font-size: 14px; margin-bottom: 8px; }
.footer-contact a { color: var(--muted); transition: color 0.2s; }
.footer-contact a:hover { color: var(--primary); }
.footer-bottom { border-top: 1px solid var(--border); padding-top: 32px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.footer-bottom p { color: var(--muted); font-size: 13px; }
.powered-by a { color: var(--primary); }

/* ─── WHATSAPP ─── */
.whatsapp-float { position: fixed; bottom: 32px; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; z-index: 99; box-shadow: 0 4px 20px rgba(37,211,102,0.4); transition: var(--transition); animation: wa-bounce 3s ease-in-out infinite; }
.whatsapp-float.bottom-right { right: 32px; }
.whatsapp-float.bottom-left { left: 32px; }
.whatsapp-float i { font-size: 28px; color: #fff; }
.whatsapp-float:hover { transform: scale(1.1); box-shadow: 0 8px 30px rgba(37,211,102,0.5); }
.whatsapp-tooltip { position: absolute; right: 68px; background: rgba(0,0,0,0.8); color: #fff; padding: 6px 12px; border-radius: 4px; font-size: 12px; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity 0.2s; }
.whatsapp-float.bottom-left .whatsapp-tooltip { right: auto; left: 68px; }
.whatsapp-float:hover .whatsapp-tooltip { opacity: 1; }
@keyframes wa-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

/* ─── SCROLL ANIMATIONS ─── */
.reveal, .reveal-left, .reveal-right { opacity: 0; transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal { transform: translateY(24px); }
.reveal-left { transform: translateX(-40px); }
.reveal-right { transform: translateX(40px); }
.reveal.visible, .reveal-left.visible, .reveal-right.visible { opacity: 1; transform: none; }

.reveal-up { opacity: 0; transform: translateY(30px) scale(0.95); transition: opacity 0.6s ease, transform 0.6s ease; }
.reveal-up.visible { opacity: 1; transform: translateY(0) scale(1); }`;
};

const generateJS = () => {
  return `document.addEventListener('DOMContentLoaded', function() {

  // ─── NAVBAR SCROLL ───
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', function() {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ─── MOBILE MENU ───
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() { navLinks.classList.remove('open'); });
    });
  }

  // ─── SCROLL ANIMATIONS (Intersection Observer) ───
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
  if (revealEls.length > 0) {
    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el) { observer.observe(el); });
  }

  // ─── ANIMATED COUNTERS ───
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-target')) || 0;
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;
          const timer = setInterval(function() {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current).toLocaleString() + '+';
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(function(el) { counterObserver.observe(el); });
  }

  // ─── LIGHTBOX ───
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImage');
  const galleryItems = document.querySelectorAll('.gallery-item img');
  let currentIndex = 0;

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-expand').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        currentIndex = parseInt(btn.getAttribute('data-index')) || 0;
        lightboxImg.src = galleryItems[currentIndex]?.src || '';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
      });
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', function() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
    });

    document.querySelector('.lightbox-prev')?.addEventListener('click', function() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      lightboxImg.src = galleryItems[currentIndex]?.src || '';
    });

    document.querySelector('.lightbox-next')?.addEventListener('click', function() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      lightboxImg.src = galleryItems[currentIndex]?.src || '';
    });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
      }
    });

    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') { lightbox.classList.remove('active'); }
      if (e.key === 'ArrowLeft') { document.querySelector('.lightbox-prev')?.click(); }
      if (e.key === 'ArrowRight') { document.querySelector('.lightbox-next')?.click(); }
    });
  }

  // ─── CONTACT FORM ───
  const form = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (formSuccess) {
        formSuccess.style.display = 'block';
        form.reset();
        setTimeout(function() { formSuccess.style.display = 'none'; }, 5000);
      }
    });
  }

  // ─── SMOOTH SCROLL ───
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});`;
};

export const generateWebsite = async (data) => {
  const zip = new JSZip();
  zip.file("index.html", buildHomePage(data));
  zip.file("about.html", buildAboutPage(data));
  zip.file("services.html", buildServicesPage(data));
  zip.file("gallery.html", buildGalleryPage(data));
  zip.file("contact.html", buildContactPage(data));
  zip.file("style.css", generateCSS(data));
  zip.file("script.js", generateJS(data));
  zip.file("README.txt", `FORGE STUDIO — Generated Website
================================
Business: ${data.businessName}
Generated: ${new Date().toLocaleDateString()}

HOSTING INSTRUCTIONS:
1. Extract this ZIP file
2. Go to netlify.com/drop
3. Drag the entire folder onto the page
4. Your site is live in seconds!

Alternative: Upload to GitHub Pages or any web host.

Built with Forge Studio — forgestud.netlify.app`);

  const slug = data.slug || data.businessName?.toLowerCase().replace(/\s+/g, '-') || 'website';
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${slug}-website.zip`);
};
