import React, { useState } from 'react';
import { BUSINESS_TYPES, FONT_PAIRINGS } from '../constants';
import { TEMPLATE_CONFIGS } from '../constants/templates';
const TEMPLATES = Object.keys(TEMPLATE_CONFIGS);

const Wizard = ({ step, setStep, formData, updateFormData, onGenerate }) => {
  const next = () => setStep(s => Math.min(s + 1, 5));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const Input = ({ label, value, onChange, placeholder, type = "text", required = false }) => (
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
    </div>
  );

  const TextArea = ({ label, value, onChange, placeholder }) => (
    <div className="mb-5">
      <label className="block text-xs uppercase tracking-widest text-muted mb-2">{label}</label>
      <textarea 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full bg-surface border border-border p-3 text-text focus:border-gold outline-none transition-colors resize-none placeholder:text-muted/40"
      />
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
  // Service editor component
  // ============================================================
  const ServiceEditor = () => {
    const addService = () => {
      updateFormData("services", [...formData.services, { icon: "fa-star", name: "", description: "" }]);
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
              <div className="flex gap-2 mb-2">
                <input 
                  value={service.icon} 
                  onChange={e => updateService(i, 'icon', e.target.value)}
                  placeholder="fa-icon name"
                  className="flex-1 bg-bg border border-border p-2 text-xs text-text"
                />
                <input 
                  value={service.name} 
                  onChange={e => updateService(i, 'name', e.target.value)}
                  placeholder="Service name"
                  className="flex-[2] bg-bg border border-border p-2 text-xs text-text"
                />
                <button 
                  onClick={() => removeService(i)}
                  className="px-2 text-muted hover:text-red-400 transition-colors"
                >
                  ✕
                </button>
              </div>
              <textarea 
                value={service.description}
                onChange={e => updateService(i, 'description', e.target.value)}
                placeholder="Description..."
                rows={2}
                className="w-full bg-bg border border-border p-2 text-xs text-text resize-none"
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
              <input 
                value={m.photo} 
                onChange={e => updateMember(i, 'photo', e.target.value)}
                placeholder="Photo URL (optional)"
                className="w-full bg-bg border border-border p-2 text-xs text-text"
              />
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
          <h2 className="text-2xl mb-8 font-serif">The Identity</h2>
          <Input 
            label="Business Name" 
            value={formData.businessName} 
            onChange={(v) => updateFormData("businessName", v)} 
            placeholder="e.g. Blackstone & Co."
            required
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
          </div>
          <Input 
            label="Tagline / Slogan" 
            value={formData.tagline} 
            onChange={(v) => updateFormData("tagline", v)} 
            placeholder="e.g. Excellence in every detail"
          />
          <TextArea 
            label="Short Description" 
            value={formData.description} 
            onChange={(v) => updateFormData("description", v)} 
            placeholder="Describe what you do..."
          />
          <Input 
            label="Years in Business" 
            value={formData.yearsInBusiness} 
            onChange={(v) => updateFormData("yearsInBusiness", v)} 
            placeholder="e.g. 15"
          />
          <Input 
            label="URL Slug" 
            value={formData.slug} 
            onChange={(v) => updateFormData("slug", v)} 
            placeholder="your-business-name"
          />
        </section>
      )}

      {/* STEP 2: Contact */}
      {step === 2 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">The Contact Layer</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone" value={formData.contact.phone} onChange={(v) => updateFormData("contact.phone", v)} placeholder="+1 (555) 123-4567" />
            <Input label="WhatsApp" value={formData.contact.whatsapp} onChange={(v) => updateFormData("contact.whatsapp", v)} placeholder="15551234567" />
          </div>
          <Input label="Email" value={formData.contact.email} onChange={(v) => updateFormData("contact.email", v)} placeholder="hello@yourbusiness.com" />
          <Input label="Physical Address" value={formData.contact.address} onChange={(v) => updateFormData("contact.address", v)} placeholder="123 Main St, City, Country" />
          <Input label="Google Maps Embed URL" value={formData.contact.mapsSrc} onChange={(v) => updateFormData("contact.mapsSrc", v)} placeholder="https://maps.google.com/..." />
          
          <HoursEditor />
        </section>
      )}

      {/* STEP 3: Visual Identity */}
      {step === 3 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">The Visual Identity</h2>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Primary</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.primaryColor} onChange={(e) => updateFormData("primaryColor", e.target.value)} className="w-10 h-10 bg-surface border border-border cursor-pointer" />
                <span className="text-xs text-muted font-mono">{formData.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted mb-2">Secondary</label>
              <div className="flex items-center gap-2">
                <input type="color" value={formData.secondaryColor} onChange={(e) => updateFormData("secondaryColor", e.target.value)} className="w-10 h-10 bg-surface border border-border cursor-pointer" />
                <span className="text-xs text-muted font-mono">{formData.secondaryColor}</span>
              </div>
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Template Style</label>
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
                      <span className="text-[10px] px-2 py-0.5 rounded border" 
                        style={{ borderColor: cfg.colors.primary, color: cfg.colors.primary }}>
                        {t}
                      </span>
                    </div>
                    <p className="text-[10px] mt-1 opacity-60">{cfg.description}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-xs uppercase tracking-widest text-muted mb-2">Font Pairing</label>
            <div className="space-y-2">
              {FONT_PAIRINGS.map(f => (
                <button 
                  key={f.name}
                  onClick={() => updateFormData("fontPairing", f)}
                  className={`w-full p-3 text-left border transition-all ${
                    formData.fontPairing.name === f.name 
                      ? 'border-gold text-gold bg-gold/5' 
                      : 'border-border text-muted hover:border-gold/30'
                  }`}
                >
                  <div style={{ fontFamily: f.heading }} className="text-lg leading-tight">{f.name.split(' + ')[0]}</div>
                  <div style={{ fontFamily: f.body }} className="text-xs mt-1 opacity-60">{f.name.split(' + ')[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STEP 4: Content */}
      {step === 4 && (
        <section>
          <h2 className="text-2xl mb-6 font-serif">The Content</h2>
          
          {/* Sections toggle */}
          <div className="space-y-2 mb-6">
            <h3 className="text-sm uppercase tracking-widest text-gold mb-3">Sections</h3>
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

          <div className="border-t border-border pt-6">
            {/* Collapsible content editors */}
            {formData.sections.services && <ServiceEditor />}
            {formData.sections.testimonials && <TestimonialEditor />}
            {formData.sections.faq && <FAQEditor />}
            {formData.sections.stats && <StatsEditor />}
            {formData.sections.team && <TeamEditor />}
          </div>

          {/* Image upload hints */}
          <div className="border-t border-border pt-6">
            <h3 className="text-sm uppercase tracking-widest text-gold mb-3">Media</h3>
            <p className="text-xs text-muted mb-3">Add image URLs or use defaults</p>
            <Input label="Hero Photo URL" value={formData.heroPhoto || ''} onChange={(v) => updateFormData("heroPhoto", v)} placeholder="https://images.unsplash.com/..." />
            <Input label="Team/About Photo URL" value={formData.teamPhoto || ''} onChange={(v) => updateFormData("teamPhoto", v)} placeholder="https://images.unsplash.com/..." />
          </div>
        </section>
      )}

      {/* STEP 5: Launch */}
      {step === 5 && (
        <section>
          <h2 className="text-2xl mb-8 font-serif">Launch Settings</h2>
          <Input label="Page Title" value={formData.pageTitle} onChange={(v) => updateFormData("pageTitle", v)} placeholder={formData.businessName} />
          <TextArea label="Meta Description" value={formData.metaDescription} onChange={(v) => updateFormData("metaDescription", v)} placeholder="Brief description for search engines..." />
          
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
            className="w-full py-4 bg-gold text-bg font-bold text-lg hover:bg-gold-light transition-all shadow-lg shadow-gold/20 uppercase tracking-widest"
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
          <button onClick={prev} className="px-6 py-2.5 border border-border text-muted hover:text-gold hover:border-gold/50 transition-colors font-mono uppercase text-xs tracking-widest">
            ← Back
          </button>
        ) : <div />}
        {step < 5 && (
          <button onClick={next} className="ml-auto px-8 py-2.5 bg-surface border border-gold text-gold hover:bg-gold hover:text-bg transition-all font-mono uppercase text-xs tracking-widest">
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Wizard;