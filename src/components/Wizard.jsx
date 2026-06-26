import React, { useState } from 'react';
import { BUSINESS_TYPES, FONT_PAIRINGS } from '../constants';
import { TEMPLATE_CONFIGS } from '../constants/templates';
const TEMPLATES = Object.keys(TEMPLATE_CONFIGS);

// Default services per business type
const DEFAULT_SERVICES = {
  "Law Firm": [
    { icon: "⚖️", name: "Corporate Law", description: "Comprehensive legal counsel for businesses and institutions." },
    { icon: "🛡️", name: "Litigation", description: "Expert representation in civil and commercial disputes." },
    { icon: "📋", name: "Legal Consultation", description: "Strategic legal advice tailored to your needs." }
  ],
  "Real Estate Agency": [
    { icon: "🏠", name: "Property Sales", description: "Premium residential and commercial property sales." },
    { icon: "🔑", name: "Property Management", description: "Full-service management for your real estate assets." },
    { icon: "📊", name: "Market Analysis", description: "Data-driven insights for smart investment decisions." }
  ],
  "Dental Clinic": [
    { icon: "🦷", name: "General Dentistry", description: "Comprehensive dental care for the whole family." },
    { icon: "✨", name: "Cosmetic Dentistry", description: "Transform your smile with advanced aesthetic treatments." },
    { icon: "🛠️", name: "Restorative Care", description: "Rebuild and restore your dental health." }
  ],
  "Beauty Salon/Spa": [
    { icon: "💇", name: "Hair Styling", description: "Expert cuts, colors, and styling for a stunning look." },
    { icon: "💆", name: "Spa Treatments", description: "Luxurious facials, massages, and body treatments." },
    { icon: "💅", name: "Nail Services", description: "Premium manicure, pedicure, and nail art." }
  ],
  "Gym/Fitness Studio": [
    { icon: "💪", name: "Personal Training", description: "One-on-one coaching tailored to your fitness goals." },
    { icon: "🧘", name: "Group Classes", description: "High-energy classes for every fitness level." },
    { icon: "🥗", name: "Nutrition Coaching", description: "Custom meal plans for optimal performance." }
  ],
  "Iron/Steel/Metal Factory": [
    { icon: "🏭", name: "Steel Fabrication", description: "Precision steel fabrication for industrial and commercial applications." },
    { icon: "🔧", name: "Metal Works", description: "Custom metalwork from design through finishing." },
    { icon: "📦", name: "Industrial Supply", description: "Reliable supply chain for raw and processed metals." }
  ],
  "Airline/Aviation": [
    { icon: "✈️", name: "Charter Flights", description: "Private and group charter services worldwide." },
    { icon: "🛩️", name: "Aircraft Management", description: "Comprehensive management for private aircraft owners." },
    { icon: "🔧", name: "Maintenance Services", description: "Expert maintenance and technical support." }
  ],
  "Construction Company": [
    { icon: "🏗️", name: "General Contracting", description: "Full-service construction management for any scale." },
    { icon: "📐", name: "Architectural Design", description: "Innovative design solutions built to inspire." },
    { icon: "🔨", name: "Renovation", description: "Transform existing spaces with premium craftsmanship." }
  ],
  "Restaurant/Fine Dining": [
    { icon: "🍽️", name: "Fine Dining", description: "An exquisite culinary experience crafted by master chefs." },
    { icon: "🍷", name: "Wine Pairing", description: "Curated wine selections to complement every dish." },
    { icon: "🎉", name: "Private Events", description: "Exclusive dining experiences for special occasions." }
  ],
  "Luxury Hotel/Resort": [
    { icon: "🏨", name: "Luxury Stays", description: "World-class accommodations with unparalleled service." },
    { icon: "🍴", name: "Fine Dining", description: "Gourmet restaurants helmed by acclaimed chefs." },
    { icon: "🧖", name: "Spa & Wellness", description: "Rejuvenating treatments in a serene sanctuary." }
  ],
  "Pharmacy/Health Clinic": [
    { icon: "💊", name: "Pharmacy Services", description: "Expert pharmaceutical care and medication management." },
    { icon: "🩺", name: "Health Consultations", description: "Comprehensive health assessments and advice." },
    { icon: "💉", name: "Vaccinations", description: "Immunization services for all ages." }
  ],
  "Boutique/Retail": [
    { icon: "🛍️", name: "Curated Collections", description: "Handpicked selections from the world's finest brands." },
    { icon: "👗", name: "Personal Styling", description: "One-on-one styling sessions for a signature look." },
    { icon: "🎁", name: "Concierge Shopping", description: "Personalized shopping experiences, private and exclusive." }
  ],
  "Creative Agency": [
    { icon: "🎨", name: "Brand Design", description: "Strategic brand identities that captivate and convert." },
    { icon: "📱", name: "Digital Marketing", description: "Data-driven campaigns that deliver measurable results." },
    { icon: "✍️", name: "Content Creation", description: "Compelling storytelling across every medium." }
  ],
  "Engineering Firm": [
    { icon: "🏗️", name: "Structural Engineering", description: "Innovative structural solutions built on precision." },
    { icon: "⚡", name: "Systems Design", description: "Comprehensive engineering systems for complex projects." },
    { icon: "📋", name: "Project Consulting", description: "Expert technical guidance from concept to completion." }
  ],
  "Other": [
    { icon: "⭐", name: "Premium Service", description: "Tailored solutions designed for discerning clients." },
    { icon: "🤝", name: "Consultation", description: "Expert guidance from industry professionals." },
    { icon: "💎", name: "Support", description: "Dedicated support every step of the way." }
  ]
};

const Wizard = ({ step, setStep, formData, updateFormData, onGenerate }) => {
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [sectionsExpanded, setSectionsExpanded] = useState(false);

  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  // Handle file upload to base64
  const handleFileUpload = (field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      updateFormData(field, e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle gallery uploads
  const handleGalleryUpload = (files) => {
    const total = (formData.productGallery || []).length + files.length;
    if (total > 8) {
      alert('Maximum 8 gallery photos allowed.');
      return;
    }
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateFormData('productGallery', [...(formData.productGallery || []), e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index) => {
    const updated = [...(formData.productGallery || [])];
    updated.splice(index, 1);
    updateFormData('productGallery', updated);
  };

  // === Website Import ===
  const handleImport = async () => {
    if (!importUrl.trim()) {
      setImportError('Please enter a website URL.');
      return;
    }
    setImportLoading(true);
    setImportError('');

    try {
      const url = importUrl.trim();
      let businessName = '';
      let description = '';
      let tagline = '';
      let phone = '';
      let email = '';
      let address = '';
      let socials = [];
      let heroImage = '';
      let yearsInBusiness = '';

      // Helper to clean domain-based name
      const domainToName = (hostname) => {
        return hostname
          .replace('www.', '')
          .split('.')[0]
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase());
      };

      // Helper: try to extract structured data from HTML
      const parseHTML = (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const ogTitle = doc.querySelector('meta[property="og:title"]')?.content;
        const ogDesc = doc.querySelector('meta[property="og:description"]')?.content;
        const ogImage = doc.querySelector('meta[property="og:image"]')?.content;
        const twitterTitle = doc.querySelector('meta[name="twitter:title"]')?.content;
        const metaDesc = doc.querySelector('meta[name="description"]')?.content;
        const pageTitle = doc.querySelector('title')?.textContent;
        
        // Business name (prioritize OG title > twitter title > page title)
        businessName = ogTitle || twitterTitle || pageTitle || '';
        // Clean trailing "| BusinessName" or "- BusinessName" patterns
        businessName = businessName.replace(/\s*[|-]\s*.*$/, '').trim();
        
        // Description
        description = ogDesc || metaDesc || '';
        
        // Tagline: try og:description or meta description (short version)
        tagline = (ogDesc || metaDesc || '').split('.')[0];
        if (tagline.length > 80) tagline = tagline.substring(0, 77) + '...';
        
        // Hero image
        heroImage = ogImage || '';
        
        // Phone: look for tel: links, specific patterns
        const telLinks = doc.querySelectorAll('a[href^="tel:"]');
        if (telLinks.length > 0) {
          phone = telLinks[0].href.replace('tel:', '').trim();
        }
        if (!phone) {
          const bodyText = doc.body?.textContent || '';
          // More precise phone regex for international formats
          const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{2,4}[-.\s]?\d{3,9}/g;
          const matches = bodyText.match(phoneRegex);
          if (matches) {
            // Pick the most plausible phone number (not a large number from other content)
            phone = matches.find(m => m.length >= 7 && m.length <= 20) || matches[0];
          }
        }
        
        // Email: look for mailto: links first
        const mailLinks = doc.querySelectorAll('a[href^="mailto:"]');
        if (mailLinks.length > 0) {
          email = mailLinks[0].href.replace('mailto:', '').split('?')[0].trim();
        }
        if (!email) {
          const bodyText = doc.body?.textContent || '';
          const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
          const matches = bodyText.match(emailRegex);
          if (matches) email = matches[0];
        }
        
        // Address: look for structured data or common patterns
        const addressEl = doc.querySelector('[itemprop="address"]') || 
                          doc.querySelector('[itemtype*="PostalAddress"]') ||
                          doc.querySelector('.address, #address, [class*="address"]');
        if (addressEl) {
          address = addressEl.textContent?.trim() || '';
        }
        if (!address) {
          const bodyText = doc.body?.textContent || '';
          const addressRegex = /\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Way|Place|Pl)\s*[,\n]\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/g;
          const match = bodyText.match(addressRegex);
          if (match) address = match[0];
        }
        
        // Years in business: look for patterns like "Founded in 2010", "Est. 2010", "20+ years"
        const bodyText = doc.body?.textContent || '';
        const foundedMatch = bodyText.match(/(?:founded|established|est\.?|since)\s*(?:in\s*)?(?:19|20)\d{2}/i);
        if (foundedMatch) {
          const year = foundedMatch[0].match(/(?:19|20)\d{2}/);
          if (year) {
            yearsInBusiness = String(new Date().getFullYear() - parseInt(year[0]));
          }
        }
        if (!yearsInBusiness) {
          const yearsRegex = /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|in\s*business|serving)/i;
          const yearsMatch = bodyText.match(yearsRegex);
          if (yearsMatch) yearsInBusiness = yearsMatch[1];
        }
        
        // Social links
        const socialPatterns = {
          instagram: /instagram\.com/i,
          facebook: /facebook\.com/i,
          linkedin: /linkedin\.com/i,
          twitter: /twitter\.com|x\.com/i,
          tiktok: /tiktok\.com/i,
          youtube: /youtube\.com/i
        };
        
        doc.querySelectorAll('a[href]').forEach(a => {
          const href = a.href;
          for (const [platform, pattern] of Object.entries(socialPatterns)) {
            if (pattern.test(href) && !socials.find(s => s.platform === platform)) {
              socials.push({ platform, url: href });
              break;
            }
          }
        });

        return { businessName, description, tagline, phone, email, address, socials, heroImage, yearsInBusiness, doc };
      };

      // Attempt 1: Try opengraph.io free tier for OG metadata
      let html = '';
      try {
        const ogResponse = await fetch(`https://opengraph.io/api/1.1/site/${encodeURIComponent(url)}?app_id=forge-studio-free`);
        if (ogResponse.ok) {
          const ogData = await ogResponse.json();
          businessName = ogData.hybridGraph?.title || ogData.openGraph?.title || '';
          description = ogData.hybridGraph?.description || ogData.openGraph?.description || '';
          tagline = (description || '').split('.')[0];
          if (tagline.length > 80) tagline = tagline.substring(0, 77) + '...';
          heroImage = ogData.openGraph?.image?.url || ogData.hybridGraph?.image || '';
        }
      } catch (e) {
        // Silently continue to fallback
      }

      // Attempt 2: Try direct HTML parsing via CORS proxy
      if (!businessName) {
        try {
          const proxyResponse = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
          if (proxyResponse.ok) {
            html = await proxyResponse.text();
            const result = parseHTML(html);
            businessName = result.businessName;
            description = result.description;
            tagline = result.tagline;
            phone = result.phone;
            email = result.email;
            address = result.address;
            socials = result.socials;
            heroImage = result.heroImage;
            yearsInBusiness = result.yearsInBusiness;
          }
        } catch (e) {
          // Silently fail
        }
      }

      // Attempt 3: Try JSONPlaceholder-style structured data extraction
      if (!businessName && html) {
        try {
          // Try JSON-LD structured data
          const jsonLdScripts = new DOMParser().parseFromString(html, 'text/html').querySelectorAll('script[type="application/ld+json"]');
          for (const script of jsonLdScripts) {
            try {
              const data = JSON.parse(script.textContent);
              const graph = data['@graph'] || [data];
              for (const item of graph) {
                if (item.name && !businessName) businessName = item.name;
                if (item.description && !description) description = item.description;
                if (item.telephone && !phone) phone = item.telephone;
                if (item.email && !email) email = item.email;
                if (item.address?.streetAddress) address = [item.address.streetAddress, item.address.addressLocality, item.address.addressRegion, item.address.postalCode].filter(Boolean).join(', ');
                if (item.image && !heroImage) heroImage = typeof item.image === 'string' ? item.image : item.image.url || '';
              }
            } catch(e) {}
          }
        } catch (e) {}
      }

      // Attempt 4: Extract from URL hostname as fallback
      if (!businessName) {
        try {
          const hostname = new URL(url).hostname;
          businessName = domainToName(hostname);
        } catch (e) {}
      }

      // Apply extracted data to form
      if (businessName) updateFormData('businessName', businessName);
      if (description) updateFormData('description', description);
      if (tagline) updateFormData('tagline', tagline);
      if (email) updateFormData('contact.email', email);
      if (phone) updateFormData('contact.phone', phone);
      if (address) updateFormData('contact.address', address);
      if (yearsInBusiness) updateFormData('yearsInBusiness', yearsInBusiness);
      if (heroImage) updateFormData('heroPhoto', heroImage);
      if (socials.length > 0) updateFormData('socials', socials);

      setImportLoading(false);
      if (!businessName) {
        setImportError('Could not extract data from this URL. Please fill in manually.');
      } else {
        // Show brief success feedback
        setImportError('');
      }
    } catch (err) {
      setImportLoading(false);
      setImportError('Import failed. Please enter your details manually.');
    }
  };

  const Input = ({ label, value, onChange, placeholder, type = "text", required = false, hint = "" }) => (
    <div className="mb-5">
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label} {required && <span className="text-gold">*</span>}</label>
      <input 
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface border border-border p-3 text-text focus:border-gold outline-none transition-colors placeholder:text-muted/40"
        required={required}
      />
      {hint && <p className="text-[10px] text-muted/60 mt-1">{hint}</p>}
    </div>
  );

  const TextArea = ({ label, value, onChange, placeholder, hint = "" }) => (
    <div className="mb-5">
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-surface border border-border p-3 text-text focus:border-gold outline-none transition-colors resize-none placeholder:text-muted/40"
      />
      {hint && <p className="text-[10px] text-muted/60 mt-1">{hint}</p>}
    </div>
  );

  const FileUpload = ({ label, value, onChange, hint = "", accept = "image/*" }) => (
    <div className="mb-5">
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="w-full bg-surface border border-border border-dashed p-3 text-text hover:border-gold/50 transition-colors text-xs text-muted text-center">
            {value ? '✓ Photo uploaded' : 'Click to upload'}
          </div>
          <input 
            type="file"
            accept={accept}
            onChange={(e) => onChange(e.target.files[0] || null)}
            className="hidden"
          />
        </label>
        {value && (
          <button 
            onClick={() => onChange(null)}
            className="text-xs text-muted hover:text-red-400 transition-colors px-2"
          >
            ✕
          </button>
        )}
      </div>
      {value && (
        <div className="mt-2">
          <img src={value} alt="Preview" className="w-20 h-20 object-cover border border-border" />
        </div>
      )}
      {hint && <p className="text-[10px] text-muted/60 mt-1">{hint}</p>}
    </div>
  );

  const renderStepIndicator = () => (
    <div className="flex gap-2 mb-8">
      {[1, 2, 3, 4, 5].map(s => (
        <div 
          key={s}
          className={`flex-1 h-0.5 rounded-full transition-all duration-500 ${
            s <= step ? 'bg-gold' : 'bg-border'
          }`}
        />
      ))}
    </div>
  );

  // ============================================================
  // Service editor component (simplified)
  // ============================================================
  const ServiceEditor = () => {
    const addService = () => {
      updateFormData("services", [...formData.services, { icon: "⭐", name: "", description: "" }]);
    };

    const updateService = (index, field, value) => {
      const updated = [...formData.services];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData("services", updated);
    };

    const removeService = (index) => {
      const updated = formData.services.filter((_, i) => i !== index);
      updateFormData("services", updated);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-gold">Services</h3>
          <button 
            onClick={addService}
            className="text-xs px-3 py-1.5 border border-dashed border-gold text-gold hover:bg-gold/10 transition-all"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {formData.services.map((service, i) => (
            <div key={i} className="p-3 border border-border glass">
              <div className="flex gap-2 mb-2 items-center">
                <input 
                  value={service.icon} 
                  onChange={e => updateService(i, 'icon', e.target.value)}
                  placeholder="⭐"
                  className="w-10 bg-bg border border-border p-2 text-sm text-text text-center"
                />
                <input 
                  value={service.name} 
                  onChange={e => updateService(i, 'name', e.target.value)}
                  placeholder="Service name"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <button 
                  onClick={() => removeService(i)}
                  className="px-2 text-muted hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <input 
                value={service.description}
                onChange={e => updateService(i, 'description', e.target.value)}
                placeholder="One-line description..."
                className="w-full bg-bg border border-border p-2 text-xs text-text"
              />
            </div>
          ))}
          {formData.services.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">No services added. Click "+ Add" to create some.</p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // Testimonial editor component
  // ============================================================
  const TestimonialEditor = () => {
    const addTestimonial = () => {
      updateFormData("testimonials", [...formData.testimonials, { name: "", role: "", text: "" }]);
    };

    const updateTestimonial = (index, field, value) => {
      const updated = [...formData.testimonials];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData("testimonials", updated);
    };

    const removeTestimonial = (index) => {
      const updated = formData.testimonials.filter((_, i) => i !== index);
      updateFormData("testimonials", updated);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-gold">Testimonials</h3>
          <button 
            onClick={addTestimonial}
            className="text-xs px-3 py-1.5 border border-dashed border-gold text-gold hover:bg-gold/10 transition-all"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {formData.testimonials.map((t, i) => (
            <div key={i} className="p-3 border border-border glass">
              <div className="flex gap-2 mb-2">
                <input 
                  value={t.name} 
                  onChange={e => updateTestimonial(i, 'name', e.target.value)}
                  placeholder="Client name"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <input 
                  value={t.role} 
                  onChange={e => updateTestimonial(i, 'role', e.target.value)}
                  placeholder="Role/Company"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <button 
                  onClick={() => removeTestimonial(i)}
                  className="px-2 text-muted hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <textarea 
                value={t.text}
                onChange={e => updateTestimonial(i, 'text', e.target.value)}
                placeholder="Testimonial text..."
                rows={2}
                className="w-full bg-bg border border-border p-2 text-xs text-text resize-none"
              />
            </div>
          ))}
          {formData.testimonials.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">No testimonials yet. Click "+ Add" to include some.</p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // FAQ editor component
  // ============================================================
  const FAQEditor = () => {
    const addFaq = () => {
      updateFormData("faqs", [...formData.faqs, { q: "", a: "" }]);
    };

    const updateFaq = (index, field, value) => {
      const updated = [...formData.faqs];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData("faqs", updated);
    };

    const removeFaq = (index) => {
      const updated = formData.faqs.filter((_, i) => i !== index);
      updateFormData("faqs", updated);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-gold">FAQs</h3>
          <button 
            onClick={addFaq}
            className="text-xs px-3 py-1.5 border border-dashed border-gold text-gold hover:bg-gold/10 transition-all"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {formData.faqs.map((faq, i) => (
            <div key={i} className="p-3 border border-border glass">
              <div className="flex gap-2 mb-2">
                <input 
                  value={faq.q} 
                  onChange={e => updateFaq(i, 'q', e.target.value)}
                  placeholder="Question..."
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <button 
                  onClick={() => removeFaq(i)}
                  className="px-2 text-muted hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <textarea 
                value={faq.a}
                onChange={e => updateFaq(i, 'a', e.target.value)}
                placeholder="Answer..."
                rows={2}
                className="w-full bg-bg border border-border p-2 text-xs text-text resize-none"
              />
            </div>
          ))}
          {formData.faqs.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">No FAQs added. Click "+ Add" to create some.</p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // Stats editor component
  // ============================================================
  const StatsEditor = () => {
    const addStat = () => {
      updateFormData("stats", [...formData.stats, { number: "", suffix: "", label: "" }]);
    };

    const updateStat = (index, field, value) => {
      const updated = [...formData.stats];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData("stats", updated);
    };

    const removeStat = (index) => {
      const updated = formData.stats.filter((_, i) => i !== index);
      updateFormData("stats", updated);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-gold">Statistics</h3>
          <button 
            onClick={addStat}
            className="text-xs px-3 py-1.5 border border-dashed border-gold text-gold hover:bg-gold/10 transition-all"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {formData.stats.map((s, i) => (
            <div key={i} className="p-3 border border-border glass flex gap-2 items-center">
              <input 
                value={s.number} 
                onChange={e => updateStat(i, 'number', e.target.value)}
                placeholder="Number"
                className="w-16 bg-bg border border-border p-2 text-xs text-text text-center"
              />
              <input 
                value={s.suffix} 
                onChange={e => updateStat(i, 'suffix', e.target.value)}
                placeholder="+"
                className="w-10 bg-bg border border-border p-2 text-xs text-text text-center"
              />
              <input 
                value={s.label} 
                onChange={e => updateStat(i, 'label', e.target.value)}
                placeholder="Label"
                className="flex-1 bg-bg border border-border p-2 text-xs text-text"
              />
              <button 
                onClick={() => removeStat(i)}
                className="px-2 text-muted hover:text-red-400 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>
          ))}
          {formData.stats.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">No custom stats. Default stats will be used.</p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // Team editor
  // ============================================================
  const TeamEditor = () => {
    const addMember = () => {
      updateFormData("teamMembers", [...formData.teamMembers, { name: "", role: "", photo: "" }]);
    };

    const updateMember = (index, field, value) => {
      const updated = [...formData.teamMembers];
      updated[index] = { ...updated[index], [field]: value };
      updateFormData("teamMembers", updated);
    };

    const removeMember = (index) => {
      const updated = formData.teamMembers.filter((_, i) => i !== index);
      updateFormData("teamMembers", updated);
    };

    const handleMemberPhoto = (index, file) => {
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        updateMember(index, 'photo', e.target.result);
      };
      reader.readAsDataURL(file);
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-widest text-gold">Team</h3>
          <button 
            onClick={addMember}
            className="text-xs px-3 py-1.5 border border-dashed border-gold text-gold hover:bg-gold/10 transition-all"
          >
            + Add
          </button>
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {formData.teamMembers.map((m, i) => (
            <div key={i} className="p-3 border border-border glass">
              <div className="flex gap-2 mb-2">
                <input 
                  value={m.name} 
                  onChange={e => updateMember(i, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <input 
                  value={m.role} 
                  onChange={e => updateMember(i, 'role', e.target.value)}
                  placeholder="Role"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <button 
                  onClick={() => removeMember(i)}
                  className="px-2 text-muted hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="flex-1 bg-bg border border-border border-dashed p-2 text-xs text-muted text-center hover:border-gold/50 transition-colors">
                  {m.photo ? '✓ Photo uploaded' : 'Upload photo'}
                </div>
                <input 
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleMemberPhoto(i, e.target.files[0])}
                  className="hidden"
                />
              </label>
              {m.photo && (
                <img src={m.photo} alt={m.name} className="w-12 h-12 object-cover mt-2 border border-border" />
              )}
            </div>
          ))}
          {formData.teamMembers.length === 0 && (
            <p className="text-xs text-muted italic text-center py-4">No team members. Default team will be shown on About page.</p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // Business Hours editor
  // ============================================================
  const HoursEditor = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <div className="space-y-2 mb-6">
        <h3 className="text-sm uppercase tracking-widest text-gold mb-3">Business Hours</h3>
        {days.map(day => {
          const h = formData.hours[day] || { open: true, from: '09:00', to: '17:00' };
          return (
            <div key={day} className="flex items-center gap-2 text-xs">
              <span className="w-8 text-muted">{day}</span>
              <button
                onClick={() => updateFormData(`hours.${day}.open`, !h.open)}
                className={`px-2 py-1 border text-xs w-14 text-center ${
                  h.open ? 'border-gold text-gold' : 'border-border text-muted'
                }`}
              >
                {h.open ? 'Open' : 'Closed'}
              </button>
              {h.open && (
                <>
                  <input 
                    type="time" 
                    value={h.from}
                    onChange={(e) => updateFormData(`hours.${day}.from`, e.target.value)}
                    className="bg-surface border border-border p-1 text-xs text-text w-20"
                  />
                  <span className="text-muted">–</span>
                  <input 
                    type="time" 
                    value={h.to}
                    onChange={(e) => updateFormData(`hours.${day}.to`, e.target.value)}
                    className="bg-surface border border-border p-1 text-xs text-text w-20"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {renderStepIndicator()}

      {/* STEP 1: Identity */}
      {step === 1 && (
        <section>
          <h2 className="text-2xl mb-6 font-serif">The Identity</h2>
          
          {/* Website Import */}
          <div className="mb-6 p-4 border border-border/50 glass">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Import from existing website</label>
            <div className="flex gap-2">
              <input 
                type="url"
                value={importUrl}
                onChange={(e) => { setImportUrl(e.target.value); setImportError(''); }}
                placeholder="https://example.com"
                className="flex-1 bg-surface border border-border p-2 text-text text-xs focus:border-gold outline-none transition-colors placeholder:text-muted/40"
              />
              <button 
                onClick={handleImport}
                disabled={importLoading}
                className="px-3 py-2 bg-gold text-bg text-xs font-bold hover:bg-gold-light transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                {importLoading ? '...' : 'Import'}
              </button>
            </div>
            {importLoading && <p className="text-[10px] text-gold mt-1">Fetching data...</p>}
            {importError && <p className="text-[10px] text-red-400 mt-1">{importError}</p>}
            <p className="text-[10px] text-muted/60 mt-1">Auto-fill your details from an existing website.</p>
          </div>

          <Input 
            label="Business Name" 
            value={formData.businessName} 
            onChange={(v) => updateFormData("businessName", v)} 
            placeholder="e.g. Blackstone & Co."
            required
            hint="Your official business name as it should appear on the website."
          />
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Business Type</label>
            <select 
              value={formData.businessType}
              onChange={(e) => updateFormData("businessType", e.target.value)}
              className="w-full bg-surface border border-border p-3 text-text focus:border-gold outline-none transition-colors"
            >
              {BUSINESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.value}</option>)}
            </select>
            <p className="text-[10px] text-muted/60 mt-1">Select your industry for tailored default content and images.</p>
          </div>
          <Input 
            label="Tagline / Slogan" 
            value={formData.tagline} 
            onChange={(v) => updateFormData("tagline", v)} 
            placeholder="e.g. Excellence in every detail"
            hint="A short, memorable phrase that captures your brand essence."
          />
          <TextArea 
            label="Short Description" 
            value={formData.description} 
            onChange={(v) => updateFormData("description", v)} 
            placeholder="Describe what you do..."
            hint="A brief overview that appears on your homepage and meta tags."
          />
          <Input 
            label="Years in Business" 
            value={formData.yearsInBusiness} 
            onChange={(v) => updateFormData("yearsInBusiness", v)} 
            placeholder="e.g. 15"
            hint="Displayed in your stats section to build trust."
          />
          <Input 
            label="URL Slug" 
            value={formData.slug} 
            onChange={(v) => updateFormData("slug", v)} 
            placeholder="your-business-name"
            hint="The website folder name. Auto-generated from your business name."
          />
        </section>
      )}

      {/* STEP 2: Contact */}
      {step === 2 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">The Contact Layer</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={formData.contact.phone} onChange={(v) => updateFormData("contact.phone", v)} placeholder="+1 (555) 123-4567" hint="Primary business phone number." />
            <Input label="WhatsApp" value={formData.contact.whatsapp} onChange={(v) => updateFormData("contact.whatsapp", v)} placeholder="15551234567" hint="Number with country code (no +)." />
          </div>
          <Input label="Email" value={formData.contact.email} onChange={(v) => updateFormData("contact.email", v)} placeholder="hello@yourbusiness.com" hint="Primary business email address." />
          <Input label="Physical Address" value={formData.contact.address} onChange={(v) => updateFormData("contact.address", v)} placeholder="123 Main St, City, Country" hint="Your office or store location." />
          <Input label="Google Maps Embed URL" value={formData.contact.mapsSrc} onChange={(v) => updateFormData("contact.mapsSrc", v)} placeholder="https://maps.google.com/..." hint="Embed code from Google Maps share → Embed a map." />
          
          <HoursEditor />
        </section>
      )}

      {/* STEP 3: Visual Identity */}
      {step === 3 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">The Visual Identity</h2>
          
          {/* Color Pickers with Hex Input */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={formData.primaryColor} 
                  onChange={(e) => updateFormData("primaryColor", e.target.value)} 
                  className="w-10 h-10 bg-surface border border-border cursor-pointer"
                />
                <input 
                  type="text"
                  value={formData.primaryColor}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.startsWith('#')) {
                      updateFormData("primaryColor", val);
                    } else {
                      updateFormData("primaryColor", '#' + val.replace(/^#/, ''));
                    }
                  }}
                  placeholder="#C9A84C"
                  className="flex-1 bg-surface border border-border p-2 text-xs text-text font-mono focus:border-gold outline-none"
                />
              </div>
              <p className="text-[10px] text-muted/60 mt-1">Your brand's primary accent color.</p>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={formData.secondaryColor} 
                  onChange={(e) => updateFormData("secondaryColor", e.target.value)} 
                  className="w-10 h-10 bg-surface border border-border cursor-pointer"
                />
                <input 
                  type="text"
                  value={formData.secondaryColor}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val.startsWith('#')) {
                      updateFormData("secondaryColor", val);
                    } else {
                      updateFormData("secondaryColor", '#' + val.replace(/^#/, ''));
                    }
                  }}
                  placeholder="#FFFFFF"
                  className="flex-1 bg-surface border border-border p-2 text-xs text-text font-mono focus:border-gold outline-none"
                />
              </div>
              <p className="text-[10px] text-muted/60 mt-1">A complementary accent for variety.</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Template Style</label>
            <p className="text-[10px] text-muted/60 mb-2">Choose a design foundation for your site.</p>
            <div className="space-y-2">
              {TEMPLATES.map(t => {
                const cfg = TEMPLATE_CONFIGS[t];
                return (
                  <button 
                    key={t}
                    onClick={() => updateFormData("templateStyle", t)}
                    className={`w-full p-3 text-left border transition-all ${
                      formData.templateStyle === t 
                        ? 'border-gold text-gold bg-gold/5' 
                        : 'border-border text-muted hover:border-gold/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{cfg.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded border" 
                          style={{ borderColor: cfg.colors.primary, color: cfg.colors.primary }}>
                          {t}
                        </span>
                        {formData.templateStyle === t && (
                          <span className="text-gold text-sm">✓</span>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] mt-1 opacity-60">{cfg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Font Pairing</label>
            <p className="text-[10px] text-muted/60 mb-2">Heading + Body font combination.</p>
            <div className="space-y-2">
              {FONT_PAIRINGS.map(f => (
                <button 
                  key={f.name}
                  onClick={() => updateFormData("fontPairing", f)}
                  className={`w-full p-3 text-left border transition-all ${
                    formData.fontPairing.name === f.name 
                      ? 'border-gold text-gold bg-gold/5 shadow-[0_0_10px_rgba(201,168,76,0.15)]' 
                      : 'border-border text-muted hover:border-gold/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div style={{ fontFamily: f.heading }} className="text-lg leading-tight">{f.name.split(' + ')[0]}</div>
                      <div style={{ fontFamily: f.body }} className="text-xs mt-1 opacity-60">{f.name.split(' + ')[1]}</div>
                    </div>
                    {formData.fontPairing.name === f.name && (
                      <span className="text-gold text-lg ml-2">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Uploads */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm uppercase tracking-widest text-gold mb-4">Photos</h3>
            <p className="text-[10px] text-muted/60 mb-3">Upload your own images or leave blank for premium defaults.</p>
            
            <FileUpload 
              label="Hero Photo" 
              value={formData.heroPhoto} 
              onChange={(file) => handleFileUpload('heroPhoto', file)}
              hint="Main background image for your homepage hero section."
            />
            <FileUpload 
              label="Team/About Photo" 
              value={formData.teamPhoto} 
              onChange={(file) => handleFileUpload('teamPhoto', file)}
              hint="Image featured on the About section."
            />

            {/* Product/Gallery Photos */}
            <div className="mb-5">
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Product / Gallery Photos</label>
              <p className="text-[10px] text-muted/60 mb-2">Upload up to 8 photos for your gallery page.</p>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="w-full bg-surface border border-border border-dashed p-3 text-text hover:border-gold/50 transition-colors text-xs text-muted text-center">
                    + Add Photos ({(formData.productGallery || []).length}/8)
                  </div>
                  <input 
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleGalleryUpload(e.target.files)}
                    className="hidden"
                    disabled={(formData.productGallery || []).length >= 8}
                  />
                </label>
              </div>
              {(formData.productGallery || []).length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {formData.productGallery.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img} alt={`Gallery ${i+1}`} className="w-full h-16 object-cover border border-border" />
                      <button 
                        onClick={() => removeGalleryImage(i)}
                        className="absolute top-0 right-0 bg-black/70 text-white text-[10px] px-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* STEP 4: Content */}
      {step === 4 && (
        <section>
          <h2 className="text-2xl mb-6 font-serif">The Content</h2>
          
          {/* Sections toggle - collapsed by default */}
          <div className="mb-6">
            <button 
              onClick={() => setSectionsExpanded(!sectionsExpanded)}
              className="flex items-center justify-between w-full p-3 border border-border glass"
            >
              <h3 className="text-sm uppercase tracking-widest text-gold">Sections</h3>
              <span className={`text-xs text-muted transition-transform ${sectionsExpanded ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            {sectionsExpanded && (
              <div className="space-y-2 mt-2 p-2">
                {Object.keys(formData.sections).map(s => (
                  <div key={s} className="flex items-center justify-between p-2.5 border border-border glass">
                    <span className="text-xs capitalize">{s}</span>
                    <input 
                      type="checkbox" 
                      checked={formData.sections[s]} 
                      onChange={(e) => updateFormData(`sections.${s}`, e.target.checked)}
                      className="accent-gold cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted/60 mt-1">Click to expand and toggle which sections appear on your site.</p>
          </div>

          <div className="border-t border-border pt-6">
            {/* Pre-fill services based on business type */}
            {formData.sections.services && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm uppercase tracking-widest text-gold">Services</h3>
                  {formData.services.length === 0 && (
                    <button
                      onClick={() => {
                        const defaults = DEFAULT_SERVICES[formData.businessType] || DEFAULT_SERVICES["Other"];
                        updateFormData("services", defaults);
                      }}
                      className="text-[10px] px-2 py-1 border border-gold/50 text-gold hover:bg-gold/10"
                    >
                      Use Defaults
                    </button>
                  )}
                </div>
                <ServiceEditor />
              </>
            )}
            {formData.sections.testimonials && <TestimonialEditor />}
            {formData.sections.faq && <FAQEditor />}
            {formData.sections.stats && <StatsEditor />}
            {formData.sections.team && <TeamEditor />}
          </div>

          {/* Media Section removed - now in Step 3 */}
        </section>
      )}

      {/* STEP 5: Launch */}
      {step === 5 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">Launch Settings</h2>
          <Input label="Page Title" value={formData.pageTitle} onChange={(v) => updateFormData("pageTitle", v)} placeholder={formData.businessName} hint="Browser tab title for your website." />
          <TextArea label="Meta Description" value={formData.metaDescription} onChange={(v) => updateFormData("metaDescription", v)} placeholder="Brief description for search engines..." hint="SEO meta description (appears in search results)." />
          
          <div className="flex items-center justify-between p-3 border border-border glass mb-6">
            <span className="text-xs uppercase tracking-widest text-muted">WhatsApp Float Button</span>
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={formData.sections.whatsappFloat} 
                onChange={(e) => updateFormData("sections.whatsappFloat", e.target.checked)}
                className="accent-gold cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-border glass mb-8">
            <span className="text-xs uppercase tracking-widest text-muted">"Powered by Forge Studio"</span>
            <input 
              type="checkbox" 
              checked={formData.poweredBy} 
              onChange={(e) => updateFormData("poweredBy", e.target.checked)}
              className="accent-gold cursor-pointer"
            />
          </div>
          
          <button 
            onClick={onGenerate}
            className="w-full py-5 bg-gold text-bg font-bold text-lg hover:bg-gold-light transition-all shadow-lg shadow-gold/30 uppercase tracking-widest border border-gold hover:shadow-[0_0_30px_rgba(201,168,76,0.4)]"
          >
            ⚡ Generate Website
          </button>

          <p className="text-xs text-muted text-center mt-4">
            Your site will be downloaded as a ZIP file — drag it to Netlify Drop to launch instantly.
          </p>
        </section>
      )}

      {/* Navigation Buttons */}
      <div className="mt-10 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={prev} className="px-8 py-3 border border-border text-muted hover:text-gold hover:border-gold/50 transition-colors font-mono uppercase text-sm tracking-widest">
            ← Back
          </button>
        ) : <div />}
        <div className="flex gap-3">
          {step > 1 && step < 5 && (
            <button 
              onClick={() => setStep(s => Math.min(s + 1, 5))}
              className="px-3 py-3 border border-dashed border-gold/40 text-gold/60 hover:text-gold hover:border-gold transition-all font-mono uppercase text-xs tracking-widest"
            >
              Skip →
            </button>
          )}
          {step < 5 && (
            <button onClick={next} className="ml-auto px-10 py-3 bg-gold text-bg font-bold hover:bg-gold-light transition-all font-mono uppercase text-sm tracking-widest shadow-lg shadow-gold/20">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wizard;