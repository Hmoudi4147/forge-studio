import React, { useState, useEffect } from 'react';
import Wizard from './components/Wizard';
import Preview from './components/Preview';
import { BUSINESS_TYPES, FONT_PAIRINGS, TEMPLATE_CONFIGS } from './constants';
import { generateWebsite } from './utils/generator';

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    businessName: "",
    businessType: "Law Firm",
    tagline: "",
    description: "",
    yearsInBusiness: "",
    slug: "",
    contact: {
      phone: "",
      whatsapp: "",
      email: "",
      address: "",
      mapsSrc: ""
    },
    socials: [],
    hours: {
      Mon: { open: true, from: "09:00", to: "17:00" },
      Tue: { open: true, from: "09:00", to: "17:00" },
      Wed: { open: true, from: "09:00", to: "17:00" },
      Thu: { open: true, from: "09:00", to: "17:00" },
      Fri: { open: true, from: "09:00", to: "17:00" },
      Sat: { open: false, from: "09:00", to: "17:00" },
      Sun: { open: false, from: "09:00", to: "17:00" }
    },
    primaryColor: TEMPLATE_CONFIGS.OBSIDIAN.colors.primary,
    secondaryColor: TEMPLATE_CONFIGS.OBSIDIAN.colors.secondary,
    templateStyle: "OBSIDIAN",
    fontPairing: FONT_PAIRINGS[0],
    heroPhoto: null,
    galleryImages: [],
    teamPhoto: null,
    sections: {
      hero: true,
      about: true,
      services: true,
      gallery: true,
      team: true,
      testimonials: true,
      faq: true,
      stats: true,
      contact: true,
      whatsappFloat: true
    },
    services: [],
    testimonials: [],
    faqs: [],
    stats: [],
    teamMembers: [],
    pageTitle: "",
    metaDescription: "",
    whatsappColor: "#25D366",
    whatsappPosition: "bottom-right",
    cookieBanner: true,
    gaId: "",
    poweredBy: true,
    productGallery: [] // up to 8 uploaded photos
  });

  const updateFormData = (path, value) => {
    const keys = path.split('.');
    if (keys.length === 1) {
      setFormData(prev => ({ ...prev, [keys[0]]: value }));
    } else {
      setFormData(prev => {
        const newData = { ...prev };
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] };
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newData;
      });
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setLoadingProgress(0);
    
    try {
      const messages = [
        "Crafting your identity...",
        "Building your pages...",
        "Polishing the details...",
        "Packaging your files..."
      ];
      
      for (let i = 0; i < messages.length; i++) {
        setLoadingMessage(messages[i]);
        setLoadingProgress((i + 1) / messages.length * 70);
        // Small delay for UX feel
        if (i < messages.length - 1) {
          await new Promise(r => setTimeout(r, 800));
        }
      }
      
      setLoadingMessage("Packaging your files...");
      setLoadingProgress(85);
      
      await generateWebsite(formData);
      
      setLoadingProgress(100);
      await new Promise(r => setTimeout(r, 500));
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  // Sync colors and fonts when template style changes
  useEffect(() => {
    const config = TEMPLATE_CONFIGS[formData.templateStyle];
    if (config) {
      setFormData(prev => ({
        ...prev,
        primaryColor: config.colors.primary,
        secondaryColor: config.colors.secondary,
        fontPairing: FONT_PAIRINGS.find(f => f.heading === config.typography.heading) || prev.fontPairing
      }));
    }
  }, [formData.templateStyle]);

  // Sync content when business type changes
  useEffect(() => {
    const typeData = BUSINESS_TYPES.find(t => t.value === formData.businessType);
    if (typeData) {
      setFormData(prev => ({
        ...prev,
        heroText: prev.heroText || typeData.hero,
        ctaText: prev.ctaText || typeData.cta,
        servicesLabel: typeData.servicesLabel || "Services"
      }));
    }
  }, [formData.businessType]);

  useEffect(() => {
    if (formData.businessName) {
      const slug = formData.businessName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      setFormData(prev => ({ ...prev, slug, pageTitle: prev.pageTitle || formData.businessName }));
    }
  }, [formData.businessName]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center noise">
        <div className="text-gold text-4xl font-serif mb-8 animate-pulse">FORGE STUDIO</div>
        <div className="w-64 h-1 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-gold animate-loading-bar"></div>
        </div>
        <p className="mt-4 text-muted font-mono">{loadingMessage}</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-bg z-50 flex flex-col items-center justify-center noise">
        <h1 className="text-6xl text-gold mb-4 font-serif">✨ Website Forged!</h1>
        <p className="text-text mb-8">Your premium digital presence is ready for the world.</p>
        <div className="flex gap-4">
          <button 
            onClick={() => setSuccess(false)}
            className="px-8 py-4 bg-gold text-bg font-bold hover:bg-gold-light transition-colors uppercase tracking-widest"
          >
            Build Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text noise flex flex-col md:flex-row">
      <div className="w-full md:w-[40%] h-screen overflow-y-auto border-r border-border p-8 bg-surface/50 backdrop-blur-md">
        <header className="mb-12">
          <h1 className="text-4xl text-gold mb-2 font-serif">FORGE STUDIO</h1>
          {/* Gold Progress Bar */}
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-500 rounded-full" 
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-muted font-mono text-xs uppercase tracking-widest">Step {step} of 5</p>
            <p className="text-gold text-[10px] font-mono uppercase tracking-wider">
              {['Identity', 'Contact', 'Visual', 'Content', 'Launch'][step - 1]}
            </p>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-xs">
              {error}
            </div>
          )}
        </header>

        <Wizard 
          step={step} 
          setStep={setStep} 
          formData={formData} 
          updateFormData={updateFormData} 
          onGenerate={handleGenerate}
        />
      </div>

      <div className="hidden md:block w-[60%] h-screen bg-bg p-4 flex flex-col">
        <Preview formData={formData} />
      </div>
    </div>
  );
}

export default App;
