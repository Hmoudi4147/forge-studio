import { TEMPLATE_CONFIGS } from './constants/templates';

export const BUSINESS_TYPES = [
  { value: "Law Firm", primary: "#0D1B2A", secondary: "#C9A84C", hero: "Justice. Strategy. Excellence.", cta: "Book a Consultation", servicesLabel: "Practice Areas" },
  { value: "Real Estate Agency", primary: "#1A1A1A", secondary: "#F5F5F0", hero: "Find Your Perfect Space", cta: "Schedule a Viewing" },
  { value: "Dental Clinic", primary: "#1B6CA8", secondary: "#F5F5F0", hero: "Your Smile, Our Passion", cta: "Book Appointment" },
  { value: "Beauty Salon/Spa", primary: "#B76E79", secondary: "#F5F5F0", hero: "Where Beauty Meets Luxury", cta: "Book Your Experience" },
  { value: "Gym/Fitness Studio", primary: "#0A0A0A", secondary: "#FF4D00", hero: "Built Different. Train Different.", cta: "Start Free Trial" },
  { value: "Iron/Steel/Metal Factory", primary: "#1C2526", secondary: "#D4500A", hero: "Forged in Strength. Built to Last.", cta: "Request a Quote" },
  { value: "Airline/Aviation", primary: "#001F5B", secondary: "#E5E4E2", hero: "The Sky Is Not The Limit.", cta: "Explore Routes" },
  { value: "Construction Company", primary: "#2D2D2D", secondary: "#F5A623", hero: "Building Tomorrow. Today.", cta: "Get a Free Quote" },
  { value: "Restaurant/Fine Dining", primary: "#2C0A0A", secondary: "#D4AF37", hero: "A Culinary Experience Unlike Any Other", cta: "Reserve a Table" },
  { value: "Luxury Hotel/Resort", primary: "#0D2818", secondary: "#C9A84C", hero: "Where Every Stay Becomes a Memory", cta: "Check Availability" },
  { value: "Pharmacy/Health Clinic", primary: "#1B6CA8", secondary: "#F5F5F0", hero: "Caring for Your Health", cta: "Visit Us" },
  { value: "Boutique/Retail", primary: "#111111", secondary: "#C9A84C", hero: "Curated Style for You", cta: "Shop Now" },
  { value: "Creative Agency", primary: "#0A0A0B", secondary: "#C9A84C", hero: "Design That Defines", cta: "Start a Project" },
  { value: "Engineering Firm", primary: "#1C2526", secondary: "#C9A84C", hero: "Engineering the Future", cta: "Consult Now" },
  { value: "Other", primary: "#0A0A0B", secondary: "#C9A84C", hero: "Excellence in Everything We Do", cta: "Contact Us" }
];

export const TEMPLATES = Object.keys(TEMPLATE_CONFIGS);

export { TEMPLATE_CONFIGS };

export const FONT_PAIRINGS = [
  { name: "Cormorant + DM Sans", heading: "Cormorant Garamond", body: "DM Sans" },
  { name: "Playfair + Lato", heading: "Playfair Display", body: "Lato" },
  { name: "Bebas + Roboto Condensed", heading: "Bebas Neue", body: "Roboto Condensed" },
  { name: "Libre Baskerville + Source Sans", heading: "Libre Baskerville", body: "Source Sans Pro" },
  { name: "Syne + Inter", heading: "Syne", body: "Inter" }
];
